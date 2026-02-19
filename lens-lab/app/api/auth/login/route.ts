import { NextRequest, NextResponse } from 'next/server';
import { findUserByEmail } from '@/lib/users';
import { comparePassword, signToken, setAuthCookie, isAdminEmail } from '@/lib/auth';

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ error: '请填写邮箱和密码' }, { status: 400 });
        }

        // Find user
        const user = findUserByEmail(email);
        if (!user) {
            return NextResponse.json({ error: '邮箱或密码错误' }, { status: 401 });
        }

        // Verify password
        const valid = await comparePassword(password, user.passwordHash);
        if (!valid) {
            return NextResponse.json({ error: '邮箱或密码错误' }, { status: 401 });
        }

        // Sign JWT
        const token = signToken({
            userId: user.id,
            email: user.email,
            username: user.username,
            isAdmin: isAdminEmail(user.email),
        });

        // Set cookie
        await setAuthCookie(token);

        return NextResponse.json({
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                isAdmin: isAdminEmail(user.email),
            },
        });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : '登录失败';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
