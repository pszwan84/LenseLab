import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { findUserById } from '@/lib/users';

export const maxDuration = 120;

export async function POST(req: NextRequest) {
    try {
        const { imageBase64, mimeType, prompt } = await req.json();

        // Get current user
        const user = getUserFromRequest(req);
        if (!user) {
            return NextResponse.json({ error: '请先登录' }, { status: 401 });
        }

        // Determine API config based on role
        let apiKey: string;
        let baseUrl: string;
        const model = process.env.MODEL_NAME || 'gemini-3-pro-image';

        if (user.isAdmin) {
            // Admin uses server .env
            apiKey = process.env.API_KEY || '';
            baseUrl = process.env.API_BASE_URL || 'http://127.0.0.1:8045/v1';
        } else {
            // Regular user — look up their stored config
            const dbUser = findUserById(user.userId);
            if (!dbUser || !dbUser.apiBaseUrl || !dbUser.apiKey) {
                return NextResponse.json(
                    { error: '请先在设置中配置你的 API 端点和 Key。' },
                    { status: 403 }
                );
            }
            apiKey = dbUser.apiKey;
            baseUrl = dbUser.apiBaseUrl;
        }

        if (!apiKey) {
            return NextResponse.json(
                { error: '未配置 API Key。' },
                { status: 401 }
            );
        }

        if (!imageBase64 || !prompt) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Build prompt
        const systemPrompt = `You are an image transformation engine. You MUST output ONLY a transformed image. 
CRITICAL RULES:
- Keep the EXACT same composition, perspective, camera angle, and spatial arrangement as the input image.
- Transform the STYLE and APPEARANCE only, never the layout or structure.
- Do NOT add text, watermarks, or extra objects.
- Output a single high-quality image.`;

        const fullPrompt = `${systemPrompt}\n\nTransformation instruction: ${prompt}`;

        const url = `${baseUrl}/chat/completions`;

        const payload: Record<string, unknown> = {
            model,
            size: '1024x1024',
            messages: [
                {
                    role: 'user',
                    content: [
                        {
                            type: 'image_url',
                            image_url: {
                                url: `data:${mimeType || 'image/jpeg'};base64,${imageBase64}`,
                            },
                        },
                        {
                            type: 'text',
                            text: fullPrompt,
                        },
                    ],
                },
            ],
        };

        console.log(`[LensLab] POST ${url} | model=${model} | user=${user.email}`);

        let response: Response;
        try {
            response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                },
                body: JSON.stringify(payload),
            });
        } catch (fetchError: unknown) {
            const msg = fetchError instanceof Error ? fetchError.message : String(fetchError);
            console.error('[LensLab] 无法连接到 API:', msg);
            return NextResponse.json(
                { error: `无法连接到 API (${baseUrl})。请确认代理服务正在运行。` },
                { status: 502 }
            );
        }

        if (!response.ok) {
            const errorText = await response.text().catch(() => '');
            console.error('[LensLab] API error:', response.status, errorText);
            let errorMessage = `API 错误 (${response.status})`;
            try {
                const errorData = JSON.parse(errorText);
                errorMessage = errorData?.error?.message || errorData?.detail || errorMessage;
            } catch { /* ignore */ }
            return NextResponse.json({ error: errorMessage }, { status: response.status });
        }

        const data = await response.json();
        const content = data?.choices?.[0]?.message?.content;

        if (!content) {
            return NextResponse.json({ error: '响应中没有内容' }, { status: 500 });
        }

        // Extract base64 image
        const base64Match = content.match(/data:image\/([a-zA-Z]+);base64,([A-Za-z0-9+/=\s]+)/);
        if (base64Match) {
            return NextResponse.json({
                image: base64Match[2].replace(/\s/g, ''),
                mimeType: `image/${base64Match[1]}`,
            });
        }

        // URL image
        const urlMatch = content.match(/https?:\/\/[^\s)"']+\.(png|jpg|jpeg|webp)/i);
        if (urlMatch) {
            try {
                const imgResponse = await fetch(urlMatch[0]);
                if (imgResponse.ok) {
                    const buffer = await imgResponse.arrayBuffer();
                    return NextResponse.json({
                        image: Buffer.from(buffer).toString('base64'),
                        mimeType: `image/${urlMatch[1]}`,
                    });
                }
            } catch { /* ignore */ }
        }

        // Pure base64
        if (/^[A-Za-z0-9+/=\s]{100,}$/.test(content.trim())) {
            return NextResponse.json({
                image: content.trim().replace(/\s/g, ''),
                mimeType: 'image/png',
            });
        }

        return NextResponse.json(
            { error: `模型返回了文本: "${content.substring(0, 100)}..."` },
            { status: 500 }
        );
    } catch (error: unknown) {
        console.error('[LensLab] 错误:', error);
        const message = error instanceof Error ? error.message : 'Internal server error';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
