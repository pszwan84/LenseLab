import { NextRequest, NextResponse } from 'next/server';
import { createUser, findUserByEmail } from '@/lib/users';
import { hashPassword, signToken, setAuthCookie, isAdminEmail } from '@/lib/auth';

export async function POST(req: NextRequest) {
    try {
        const { email, username, password } = await req.json();

        if (!email || !username || !password) {
            return NextResponse.json({ error: '请填写所有字段' }, { status: 400 });
        }

        if (password.length < 6) {
            return NextResponse.json({ error: '密码至少 6 位' }, { status: 400 });
        }

        // Check if already exists
        const existing = findUserByEmail(email);
        if (existing) {
            return NextResponse.json({ error: '该邮箱已注册' }, { status: 409 });
        }

        // Create user
        const passwordHash = await hashPassword(password);
        const user = createUser(email, username, passwordHash);

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
        const message = error instanceof Error ? error.message : '注册失败';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
