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

    // 4. Delete user (Cascading deletes will handle Tutor, Account, Session, Conversations, Messages)
    apiLogger.info(`Admin ${session.user.id} deleting user ${targetUserId}`);
    
    await prisma.user.delete({
      where: { id: targetUserId }
    });

    apiLogger.success(`User ${targetUserId} deleted successfully`);
    return new NextResponse(null, { status: 204 });

  } catch (error) {
    apiLogger.error("Error in DELETE /api/admin/users/[id]:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
