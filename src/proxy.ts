import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This function can be marked `async` if using `await` inside
export function proxy(request: NextRequest) {
    const token = request.cookies.get('auth_token')?.value;

    // Protect /viajero and /agencia routes
    if (
        request.nextUrl.pathname.startsWith('/viajero') ||
        request.nextUrl.pathname.startsWith('/agencia')
    ) {
        if (!token) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: ['/viajero/:path*', '/agencia/:path*'],
};
