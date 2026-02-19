import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { findUserById, updateUserApiConfig } from '@/lib/users';

// GET: return current user's API config
export async function GET(req: NextRequest) {
    const payload = getUserFromRequest(req);
    if (!payload) {
        return NextResponse.json({ error: '请先登录' }, { status: 401 });
    }

    if (payload.isAdmin) {
        return NextResponse.json({
            apiBaseUrl: process.env.API_BASE_URL || '',
            apiKey: '***admin***',
            isAdmin: true,
            note: 'Admin 使用服务器 .env 中的 API 配置',
        });
    }

    const user = findUserById(payload.userId);
    if (!user) {
        return NextResponse.json({ error: '用户不存在' }, { status: 404 });
    }

    return NextResponse.json({
        apiBaseUrl: user.apiBaseUrl,
        apiKey: user.apiKey ? '***' + user.apiKey.slice(-4) : '',
        hasConfig: !!(user.apiBaseUrl && user.apiKey),
        isAdmin: false,
    });
}

// PUT: update current user's API config
export async function PUT(req: NextRequest) {
    const payload = getUserFromRequest(req);
    if (!payload) {
        return NextResponse.json({ error: '请先登录' }, { status: 401 });
    }

    if (payload.isAdmin) {
        return NextResponse.json({ error: 'Admin 的 API 配置在 .env 中管理' }, { status: 400 });
    }

    const { apiBaseUrl, apiKey } = await req.json();

    if (!apiBaseUrl || !apiKey) {
        return NextResponse.json({ error: '请填写 API Base URL 和 API Key' }, { status: 400 });
    }

    try {
        updateUserApiConfig(payload.userId, apiBaseUrl, apiKey);
        return NextResponse.json({ ok: true, message: 'API 配置已保存' });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : '保存失败';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
