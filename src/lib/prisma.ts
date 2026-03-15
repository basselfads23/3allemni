// src/lib/prisma.ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Safely log database host to verify the target in Vercel
const dbUrl = process.env.DATABASE_URL || "";
const dbHost = dbUrl.split("@")[1]?.split("/")[0] || "unknown";
console.log(`[Prisma] Initializing client... Target Host: ${dbHost}`);

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query", "error", "warn"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

if (process.env.NODE_ENV === "production") {
  prisma.$connect()
    .then(() => console.log("[Prisma] Database connection successful"))
    .catch((err) => console.error("[Prisma] Database connection failed:", err));
}
