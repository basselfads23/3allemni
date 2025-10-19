// src/types/next-auth.d.ts
// BLOCK: NextAuth Type Augmentation
// Extends NextAuth types to include custom user fields

import { Role } from "@prisma/client";

// BLOCK: Extend NextAuth Session type
// Add custom fields to the session user object
declare module "next-auth" {
  interface Session {
    user: {
      id: number;
      email: string;
      role: Role;
      name?: string | null;
      image?: string | null;
    };
  }

  interface User {
    id: number;
    email: string;
    role: Role;
  }
}

// BLOCK: Extend NextAuth JWT type
// Add custom fields to JWT token
declare module "next-auth/jwt" {
  interface JWT {
    id: number;
    role: Role;
  }
}
