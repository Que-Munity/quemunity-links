import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/lib/prisma';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    // Temporarily disabled until OAuth credentials are set up
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_CLIENT_ID || '',
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    // }),
    // GitHubProvider({
    //   clientId: process.env.GITHUB_ID || '',
    //   clientSecret: process.env.GITHUB_SECRET || '',
    // }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Use Prisma to check credentials directly
          const bcrypt = await import('bcryptjs');
          
          const user = await prisma.user.findUnique({
            where: { email: credentials.email }
          });

          if (!user || !user.password) {
            return null;
          }

          const passwordMatch = await bcrypt.compare(credentials.password, user.password);

          if (passwordMatch) {
            return {
              id: user.id,
              email: user.email,
              name: user.name || user.username,
              username: user.username,
            };
          }

          return null;
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      }
    })
  ],
  pages: {
    signIn: '/auth/signin',
    signUp: '/auth/signup',
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub;
        session.user.username = token.username;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};