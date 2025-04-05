import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { UserType } from '@/types/user';
import { upsertUser } from '@/services/userService';

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      // Persistir os dados do usuário no banco quando fizer login
      if (account && profile && token.email) {
        try {
          const user = await upsertUser({
            email: token.email,
            name: token.name ?? undefined,
            image: token.picture ?? undefined,
          });

          token.id = user.id;
          token.userType = user.userType as UserType;
        } catch (error) {
          console.error('Erro ao salvar usuário:', error);
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.userType = (token.userType as UserType) || UserType.BASIC;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
  },
});

export { handler as GET, handler as POST };