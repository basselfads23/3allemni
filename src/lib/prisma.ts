// This file creates a single Prisma Client instance for your app
import { PrismaClient } from '@prisma/client'  // Import Prisma Client class

// Declare global variable to store Prisma instance (only in development)
const globalForPrisma = global as unknown as { prisma: PrismaClient }

// Create or reuse Prisma Client instance
export const prisma =
  globalForPrisma.prisma ||  // If already exists, use it
  new PrismaClient()  // Otherwise create new instance

// In development, store instance globally to prevent creating multiple clients during hot-reloads
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// This pattern ensures you only have one Prisma Client instance, preventing connection issues
