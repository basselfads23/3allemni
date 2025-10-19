// src/app/api/auth/[...nextauth]/route.ts
// BLOCK: NextAuth API Route
// Handles all authentication routes and OAuth flow

import { handlers } from "@/lib/auth";

// BLOCK: Export NextAuth handlers
// Export GET and POST handlers for NextAuth API routes
// These handle all auth endpoints: /api/auth/signin, /api/auth/signout, etc.
export const { GET, POST } = handlers;
