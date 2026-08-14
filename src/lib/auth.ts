import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { prisma } from './db';

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        phone: { label: 'رقم الهاتف', type: 'text', placeholder: '0555123456' },
        password: { label: 'كلمة المرور', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.phone || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { phone: credentials.phone },
        });

        if (!user || !user.password) {
          return null;
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);

        if (!isValid) {
          return null;
        }

        return {
          id: user.id,
          phone: user.phone,
          name: user.fullName,
          email: user.email ?? undefined,
          role: user.role,
          wilaya: user.wilaya,
          commune: user.commune ?? undefined,
          address: user.address ?? undefined,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.phone = user.phone;
        token.role = user.role;
        token.wilaya = user.wilaya;
        token.commune = user.commune;
        token.address = user.address;
      }
      if (trigger === 'update' && session) {
        token.wilaya = session.wilaya;
        token.commune = session.commune;
        token.address = session.address;
        token.name = session.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.phone = token.phone as string;
        session.user.name = token.name as string | undefined;
        session.user.role = token.role as string;
        session.user.wilaya = token.wilaya as string | undefined;
        session.user.commune = token.commune as string | undefined;
        session.user.address = token.address as string | undefined;
      }
      return session;
    },
  },
};
