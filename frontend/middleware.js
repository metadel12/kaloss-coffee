import { NextResponse } from 'next/server';

const publicPrefixes = ['/', '/about', '/contact', '/products', '/login', '/register', '/403', '/_next', '/favicon.svg'];
const authPrefixes = ['/cart', '/checkout', '/profile', '/orders', '/wishlist'];

export function middleware(request) {
    const { pathname, search } = request.nextUrl;
    const token = request.cookies.get('kalossToken')?.value;
    const role = request.cookies.get('kalossRole')?.value;

    if (pathname.startsWith('/admin')) {
        if (!token) {
            return NextResponse.redirect(new URL('/login', request.url));
        }

        if (!['admin', 'super_admin'].includes(role || '')) {
            return NextResponse.redirect(new URL('/403', request.url));
        }
    }

    if (authPrefixes.some(prefix => pathname.startsWith(prefix))) {
        if (!token) {
            return NextResponse.redirect(new URL(`/login?callbackUrl=${encodeURIComponent(`${pathname}${search}`)}`, request.url));
        }
    }

    if (publicPrefixes.some(prefix => prefix === '/' ? pathname === '/' : pathname.startsWith(prefix))) {
        return NextResponse.next();
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|static).*)'],
};
