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
  debug: true, // Force debug mode for more Vercel logs

  events: {
    async signIn(message) {
      console.log("[Auth] Event: signIn successful for user:", message.user.email);
    },
    async createUser(message) {
      console.log("[Auth] Event: createUser successful:", message.user.email);
    },
    async linkAccount(message) {
      console.log("[Auth] Event: linkAccount successful:", message.account.provider);
    },
  },

  // Log all database calls during authentication
  // Corrected signature for NextAuth v5 logger
  logger: {
    error(error: Error) {
      console.error("[Auth] CRITICAL ERROR:", error.name, error.message);
    },
    warn(code: string) {
      console.warn("[Auth] WARNING:", code);
    },
    debug(code: string, metadata?: unknown) {
      console.log("[Auth] DEBUG:", { code, metadata });
    },
  },

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

  // BLOCK: Pages configuration
  // Customize auth pages (optional, uses NextAuth defaults)
  pages: {
    signIn: "/auth/signin", // Custom sign-in page (optional)
  },
});
