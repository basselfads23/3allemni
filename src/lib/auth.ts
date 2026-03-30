// src/lib/auth.ts
// BLOCK: NextAuth Configuration
// Centralized authentication configuration

import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { Role } from "@prisma/client";

// BLOCK: NextAuth configuration
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  trustHost: true,
  secret: process.env.AUTH_SECRET,
  debug: false,

  // JWT strategy required when mixing OAuth + Credentials providers
  session: { strategy: "jwt" },

  // BLOCK: Custom pages
  pages: {
    signIn: "/signin",
  },

  // BLOCK: Authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "select_account",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),

    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;

        if (!email || !password) return null;

        // Validate credentials against Supabase Auth
        const { data, error } = await supabaseAdmin.auth.signInWithPassword({
          email,
          password,
        });

        if (error || !data.user?.email) return null;

        // Return the matching Prisma user for NextAuth to build the session
        const user = await prisma.user.findUnique({
          where: { email: data.user.email },
        });

        return user;
      },
    }),
  ],

  // BLOCK: Callbacks
  callbacks: {
    // Populate JWT token with id and role on every sign-in
    jwt: async ({ token, user }) => {
      if (user) {
        // user is provided only on the first sign-in event
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { id: true, role: true },
        });
        if (dbUser) {
          token.id = dbUser.id;
          token.role = dbUser.role;
        }
      }
      return token;
    },

    // Expose id and role on the session object (read from JWT token)
    session: async ({ session, token }) => {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id as string,
          role: token.role as Role,
        },
      };
    },
  },
});
