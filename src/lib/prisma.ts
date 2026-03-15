// src/lib/prisma.ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

console.log("[Prisma] Initializing client... URL defined:", !!process.env.DATABASE_URL);

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query", "error", "warn"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// Self-invoking check for production connectivity
if (process.env.NODE_ENV === "production") {
  prisma.$connect()
    .then(() => console.log("[Prisma] Database connection successful"))
    .catch((err) => console.error("[Prisma] Database connection failed:", err));
}
