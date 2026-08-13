import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

const STAFF_ROLES = ['ADMIN', 'MASTER_ADMIN', 'ORDER_CONFIRMATION_AGENT', 'PREP_AGENT', 'SHIPPING_AGENT'];

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    if (path.startsWith('/admin')) {
      if (!STAFF_ROLES.includes(token?.role as string)) {
        return NextResponse.redirect(new URL('/', req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized({ req, token }) {
        const path = req.nextUrl.pathname;
        if (path.startsWith('/account')) {
          return token !== null;
        }
        if (path.startsWith('/admin')) {
          return token !== null && STAFF_ROLES.includes(token.role as string);
        }
        return true;
      },
    },
    pages: {
      signIn: '/login',
    },
  }
);

export const config = {
  matcher: ['/account/:path*', '/admin/:path*'],
};
