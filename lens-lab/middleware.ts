import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Public routes — no auth needed
    const publicPaths = ['/login', '/api/auth/login', '/api/auth/register'];
    if (publicPaths.some((p) => pathname.startsWith(p))) {
        return NextResponse.next();
    }

    // Check for auth cookie
    const token = req.cookies.get('lenslab_token')?.value;

    if (!token && !pathname.startsWith('/api/')) {
        // Redirect to login page
        const loginUrl = new URL('/login', req.url);
        return NextResponse.redirect(loginUrl);
    }

    if (!token && pathname.startsWith('/api/') && !pathname.startsWith('/api/auth/')) {
        return NextResponse.json({ error: '请先登录' }, { status: 401 });
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        // Match all paths except static files and _next
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
