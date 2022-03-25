import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials';
import prisma from '../../../lib/prisma';
import { PrismaAdapter } from '@next-auth/prisma-adapter';

export default NextAuth({
    providers: [
      CredentialsProvider({
        name: '',
        credentials: {
          username: { label: 'Username', type: 'text', placeholder: 'Username' },
          password: { label: 'Password', type: 'password' },
        },
        async authorize(credentials) {
          var auth = null;
          let user = await prisma.user.findFirst({
              where: {
                username: credentials!.username,
                password: credentials!.password,
              },
          })
          if(user) {
            auth = user
          } else {
            const created = await prisma.user.create({
              data: {
                username: credentials!.username,
                password: credentials!.password
              } 
            })
            auth = created
          }
         
          return auth;
        },
      }),
    ],
    adapter: PrismaAdapter(prisma),
    secret: process.env.JWT_SECRET,
    session: {
      strategy: 'jwt',
      maxAge: 30 * 24 * 60 * 60,
    },
    jwt: {
      secret: process.env.JWT_SECRET,
    },
    callbacks: {
      async jwt({ token, account }) {
        if (account) {
          token.accessToken = account.access_token
        }
        return token
      },
       
      async session({ session, token }) {
        
        session.token = token
        return session
      }
      }
  });