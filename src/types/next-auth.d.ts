import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      phone?: string;
      role?: string;
      wilaya?: string;
      commune?: string;
      address?: string;
    };
  }

  interface User {
    id: string;
    phone?: string;
    role?: string;
    wilaya?: string;
    commune?: string;
    address?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    phone?: string;
    role?: string;
    wilaya?: string;
    commune?: string;
    address?: string;
  }
}
