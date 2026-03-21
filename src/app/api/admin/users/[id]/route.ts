// src/app/api/admin/users/[id]/route.ts
// BLOCK: Admin API Route - Delete User
// Handles DELETE requests to remove a user and all their data

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { apiLogger } from "@/lib/logger";

// BLOCK: DELETE Handler Function
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // 1. Authenticate and verify ADMIN
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // 2. Extract user ID
    const { id: targetUserId } = await context.params;

    // 3. Safety check: Prevent admin from deleting themselves
    if (targetUserId === session.user.id) {
      return new NextResponse("You cannot delete your own admin account", { status: 400 });
    }

    // 4. Aggressive cleanup: Manually delete sent messages first to bypass foreign key constraints
    // if the database schema hasn't been fully synced with the new cascade rules.
    apiLogger.info(`Admin ${session.user.id} performing aggressive deletion of user ${targetUserId}`);
    
    await prisma.$transaction([
      // First, wipe their sent messages
      prisma.message.deleteMany({
        where: { senderId: targetUserId }
      }),
      // Then delete the user (other cascades like Tutor/Account usually work fine)
      prisma.user.delete({
        where: { id: targetUserId }
      })
    ]);

    apiLogger.success(`User ${targetUserId} and their data wiped successfully`);
    return new NextResponse(null, { status: 204 });

  } catch (error) {
    apiLogger.error("Error in DELETE /api/admin/users/[id]:", error);
    
    // Return specific error message for debugging
    const message = error instanceof Error ? error.message : "Internal server error";
    return new NextResponse(message, { status: 500 });
  }
}
