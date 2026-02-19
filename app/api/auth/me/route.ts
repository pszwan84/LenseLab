import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { findUserById } from '@/lib/users';

export async function GET(req: NextRequest) {
    const payload = getUserFromRequest(req);
    if (!payload) {
        return NextResponse.json({ user: null }, { status: 401 });
    }

    // Fetch fresh user data to check API config status
    const user = findUserById(payload.userId);

    return NextResponse.json({
        user: {
            id: payload.userId,
            email: payload.email,
            username: payload.username,
            isAdmin: payload.isAdmin,
            hasApiConfig: payload.isAdmin || !!(user?.apiBaseUrl && user?.apiKey),
        },
    });
}
