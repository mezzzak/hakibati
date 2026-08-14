// Middleware disabled - auth handled at page level with getServerSession
// Edge runtime has issues reading JWT cookies consistently on Vercel

export { default } from 'next-auth/middleware';

export const config = {
  matcher: [],
};
