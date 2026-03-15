// src/lib/auth.ts
// BLOCK: NextAuth Configuration
// Centralized authentication configuration

import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";

// BLOCK: NextAuth configuration
// Configures authentication providers, callbacks, and session management
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  trustHost: true,
  secret: process.env.AUTH_SECRET,
  debug: false,

  // BLOCK: Authentication providers
  // Configure OAuth providers (currently only Google)
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
  ],

  // BLOCK: Callbacks for customizing behavior
  // Modify session data and handle sign-in events
  callbacks: {
    // BLOCK: Session callback
    // Adds user ID and role to session object
    // This makes user.id and user.role available in session
    session: async ({ session, user }) => {
      // Type assertion: Adapter returns full user with id and role from database
      const dbUser = user as unknown as { id: string; role: Role };
      return {
        ...session,
        user: {
          ...session.user,
          id: dbUser.id,
          role: dbUser.role,
        },
      };
    },
  },
});
