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
  apiLogger.info("GET /api/tutor/[id] - Function called");

  try {
    // BLOCK: Extract ID from URL parameters
    const params = await context.params;
    const { id: tutorId } = params;

    if (!tutorId) {
      apiLogger.error("Missing tutor ID");
      return new NextResponse("Missing tutor ID", { status: 400 });
    }

    // BLOCK: Fetch tutor using service
    apiLogger.info(`Fetching tutor from database with ID: ${tutorId}`);
    const tutor = await getTutorById(tutorId);

    // BLOCK: Handle tutor not found
    if (!tutor) {
      apiLogger.error("Tutor not found with ID:", tutorId);
      return new NextResponse("Tutor not found", { status: 404 });
    }

    apiLogger.success("Tutor found successfully:", tutor.id);

    // BLOCK: Success response
    return NextResponse.json(tutor, { status: 200 });
  } catch (error) {
    // BLOCK: Error handling
    apiLogger.error("Error occurred in GET /api/tutor/[id]:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
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
