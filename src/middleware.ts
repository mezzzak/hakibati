import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

const STAFF_ROLES = ['ADMIN', 'MASTER_ADMIN', 'ORDER_CONFIRMATION_AGENT', 'PREP_AGENT', 'SHIPPING_AGENT'];

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Protect /account routes
  if (path.startsWith('/account')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
    return NextResponse.next();
  }

  // Protect /admin routes
  if (path.startsWith('/admin')) {
    if (!token || !STAFF_ROLES.includes(token.role as string)) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/account/:path*', '/admin/:path*'],
};
