// src/app/api/tutor/[id]/route.ts
// BLOCK: API Route - Get Single Tutor by ID
// Handles GET requests to fetch a single tutor from the database

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getTutorById } from "@/services/tutorService";
import { apiLogger } from "@/lib/logger";

// BLOCK: GET Handler Function
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  apiLogger.info("GET /api/tutor/[id] - Function called");

  try {
    // BLOCK: Extract ID from URL parameters
    const params = await context.params;
    const { id } = params;
    apiLogger.info("Tutor ID from URL:", id);

    // BLOCK: Use ID from URL parameters
    const tutorId = id;
    apiLogger.debug("Using tutor ID from params:", tutorId);

    if (!tutorId) {
      apiLogger.error("Missing tutor ID");
      return new NextResponse("Missing tutor ID", { status: 400 });
    }

    // BLOCK: Fetch tutor using service
    apiLogger.info("Fetching tutor from database...");
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
    apiLogger.error("Error occurred:", (error as Error).message);

    return new NextResponse("Internal server error", { status: 500 });
  }
}
