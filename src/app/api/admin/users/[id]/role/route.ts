// src/app/api/admin/users/[id]/role/route.ts
// BLOCK: Admin API Route - Update User Role
// Handles PATCH requests to change any user's system role

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { apiLogger } from "@/lib/logger";

// BLOCK: PATCH Handler Function
export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // 1. Authenticate and verify ADMIN
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // 2. Parse request
    const { id: targetUserId } = await context.params;
    const { newRole } = await req.json();

    if (!newRole || !["ADMIN", "TUTOR", "PARENT"].includes(newRole)) {
      return new NextResponse("Invalid role", { status: 400 });
    }

    // Prevent admin from de-ranking themselves (safety check)
    if (targetUserId === session.user.id && newRole !== "ADMIN") {
      return new NextResponse("You cannot remove your own admin status", { status: 400 });
    }

    // 3. Update in database
    apiLogger.info(`Admin ${session.user.id} changing user ${targetUserId} role to ${newRole}`);
    const updatedUser = await prisma.user.update({
      where: { id: targetUserId },
      data: { role: newRole },
      select: {
        id: true,
        name: true,
        role: true,
      }
    });

    apiLogger.success(`User ${targetUserId} role updated to ${newRole}`);
    return NextResponse.json(updatedUser, { status: 200 });

  } catch (error) {
    apiLogger.error("Error in PATCH /api/admin/users/[id]/role:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
