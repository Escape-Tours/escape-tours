import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const response = NextResponse.next();

    // Get country from Vercel's edge headers
    const country = request.headers.get('x-vercel-ip-country') || 'TZ';
    const residencyTier = country === 'TZ' ? 'resident' : 'international';

    response.cookies.set('residency-tier', residencyTier, {
        path: '/',
        httpOnly: false,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
    });

    return response;
}

export const config = {
    matcher: '/itineraries/:path*',
};  