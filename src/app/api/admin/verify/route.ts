// src/app/api/admin/verify/route.ts
// BLOCK: Admin API Route - Verify Education
// Handles PATCH requests to update the verification status of degrees

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { apiLogger } from "@/lib/logger";

// BLOCK: PATCH Handler Function
export async function PATCH(req: NextRequest) {
  apiLogger.info("PATCH /api/admin/verify - Admin request received");

  try {
    // 1. Authenticate session and check ADMIN role
    const session = await auth();
    const isAuthorized = session?.user?.id && (session.user.role === "ADMIN" || session.user.role === "MASTER_ADMIN");
    
    if (!isAuthorized) {
      apiLogger.error("Unauthorized admin verification attempt");
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // 2. Parse and validate body
    const { educationId, isVerified } = await req.json();

    if (!educationId || typeof isVerified !== "boolean") {
      return new NextResponse("Missing or invalid fields", { status: 400 });
    }

    // 3. Update Education record
    apiLogger.info(`Admin updating verification for Education: ${educationId} to ${isVerified}`);
    const updated = await prisma.education.update({
      where: { id: educationId },
      data: { isVerified },
    });

    apiLogger.success(`Education ${educationId} verification updated successfully`);
    return NextResponse.json(updated, { status: 200 });

  } catch (error) {
    apiLogger.error("Error in PATCH /api/admin/verify:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
