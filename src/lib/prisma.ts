// src/lib/prisma.ts
// BLOCK: Prisma Client Singleton
// Optimized for production stability on Vercel

import { PrismaClient } from "@prisma/client";

// BLOCK: Global type augmentation
const globalForPrisma = global as unknown as { prisma: PrismaClient };

// BLOCK: Create or reuse Prisma Client instance
// Using the standard PrismaClient is more reliable for SSL handling in serverless Node.js
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

// BLOCK: Store instance globally in development
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
