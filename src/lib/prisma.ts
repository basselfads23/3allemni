// src/lib/prisma.ts
// BLOCK: Prisma Client Singleton
// This file creates and exports a single Prisma Client instance for the entire application
// Purpose: Prevents multiple database connections being created during development hot-reloads
// Used by: All API routes that need database access

// Import the PrismaClient class from Prisma package
import { PrismaClient } from "@prisma/client"; // PrismaClient: main class for database operations, imported from generated Prisma client

// BLOCK: Global type augmentation for development
// Extend the global object type to include a prisma property
const globalForPrisma = global as unknown as { prisma: PrismaClient };
// global: Node.js global object available across all modules
// as unknown as: TypeScript type assertion (two-step cast for safety)
// { prisma: PrismaClient }: type definition saying global can have a prisma property
// This allows us to store Prisma instance on global object in development

// BLOCK: Create or reuse Prisma Client instance
// Export singleton Prisma Client instance
export const prisma =
  globalForPrisma.prisma || // If prisma already exists on global object, reuse it (prevents multiple instances)
  new PrismaClient(); // Otherwise create new PrismaClient instance (first time initialization)
// export const: makes prisma available for import in other files
// ||: logical OR operator - returns first truthy value
// This pattern ensures only one client instance exists

// BLOCK: Store instance globally in development
// In development mode, store the instance on global object to survive hot-reloads
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
// process.env.NODE_ENV: environment variable set by Node.js ('development' or 'production')
// !== 'production': true in development mode
// globalForPrisma.prisma = prisma: stores instance on global object
// Why? Next.js hot-reload creates new module instances but global object persists
// In production, we don't need this because the server doesn't hot-reload

// This singleton pattern prevents "too many database connections" errors during development
