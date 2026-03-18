// src/app/api/tutor/[id]/route.ts
// BLOCK: API Route - Get Single Tutor by ID
// Handles GET requests to fetch a single tutor from the database

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getTutorById, deleteTutor } from "@/services/tutorService";
import { apiLogger } from "@/lib/logger";
import { auth } from "@/lib/auth";

// BLOCK: GET Handler Function
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  // ... (existing GET code)
}

// BLOCK: DELETE Handler Function
// Allows an authenticated user to delete their own tutor profile
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  apiLogger.info("DELETE /api/tutor/[id] - Function called");

  try {
    // 1. Authenticate user
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // 2. Extract ID from URL
    const params = await context.params;
    const { id: tutorId } = params;

    // 3. Verify ownership (tutor must belong to the logged-in user)
    const tutor = await getTutorById(tutorId);
    if (!tutor) {
      return new NextResponse("Tutor not found", { status: 404 });
    }

    if (tutor.userId !== session.user.id) {
      apiLogger.error(`Unauthorized deletion attempt by user ${session.user.id} on tutor ${tutorId}`);
      return new NextResponse("Forbidden", { status: 403 });
    }

    // 4. Delete the tutor
    await deleteTutor(tutorId);
    apiLogger.success(`Tutor ${tutorId} deleted successfully`);

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    apiLogger.error("Error in DELETE /api/tutor/[id]:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
