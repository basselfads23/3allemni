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
    .then(async () => {
      console.log(`[Prisma] Database connection successful. Host: ${dbHost}`);
      try {
        // Smoke test for the accounts table
        const count = await prisma.account.count();
        console.log(`[Prisma] Smoke test: 'accounts' table found in current schema. Count: ${count}`);
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error";
        console.error("[Prisma] Smoke test failed for 'accounts' table:", errorMessage);
        
        // Attempt to find where the 'accounts' table might be
        try {
          const tableLocations = await prisma.$queryRaw`
            SELECT table_schema, table_name 
            FROM information_schema.tables 
            WHERE table_name = 'accounts' OR table_name = 'Account'
          ` as Array<{ table_schema: string, table_name: string }>;
          
          if (tableLocations.length > 0) {
            console.log("[Prisma] Found 'accounts' table in these locations:", 
              tableLocations.map(t => `${t.table_schema}.${t.table_name}`).join(", ")
            );
          } else {
            console.log("[Prisma] 'accounts' or 'Account' table NOT FOUND in ANY schema in this database.");
            
            // List ALL tables in 'public' just to see what's there
            const publicTables = await prisma.$queryRaw`
              SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'
            ` as Array<{ table_name: string }>;
            
            console.log("[Prisma] Tables visible in 'public' schema:", 
              publicTables.length > 0 ? publicTables.map(t => t.table_name).join(", ") : "NONE"
            );
          }
        } catch (innerErr) {
          console.error("[Prisma] Failed to run deep diagnostic:", innerErr);
        }
      }
    })
    .catch((err) => console.error("[Prisma] Database connection failed:", err));
}
