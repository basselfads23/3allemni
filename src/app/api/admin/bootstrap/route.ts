// src/app/api/admin/bootstrap/route.ts
// BLOCK: Admin Bootstrap API Route
// Secure way to create the first admin using an environment secret

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { apiLogger } from "@/lib/logger";

// BLOCK: POST Handler Function
export async function POST(req: NextRequest) {
  apiLogger.info("POST /api/admin/bootstrap - Bootstrap attempt started");

  try {
    // 1. Authenticate session
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized: Please sign in first", { status: 401 });
    }

    // 2. Validate secret key from body
    const body = await req.json();
    const { secretKey } = body;

    const bootstrapSecret = process.env.ADMIN_BOOTSTRAP_SECRET;

    if (!bootstrapSecret) {
      apiLogger.error("ADMIN_BOOTSTRAP_SECRET is not set in environment variables");
      return new NextResponse("Bootstrap configuration missing", { status: 500 });
    }

    if (secretKey !== bootstrapSecret) {
      apiLogger.error(`Failed bootstrap attempt for user: ${session.user.id}`);
      return new NextResponse("Invalid secret key", { status: 403 });
    }

    // 3. Promote user to MASTER_ADMIN
    apiLogger.info(`Promoting user ${session.user.id} to MASTER_ADMIN via bootstrap`);
    await prisma.user.update({
      where: { id: session.user.id },
      data: { role: "MASTER_ADMIN" },
    });

    apiLogger.success(`User ${session.user.id} promoted to MASTER_ADMIN successfully`);
    return NextResponse.json({ message: "Promoted to Master Admin successfully. Please sign out and sign in again." }, { status: 200 });

  } catch (error) {
    apiLogger.error("Error in POST /api/admin/bootstrap:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
