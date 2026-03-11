// src/app/api/tutors/route.ts
// BLOCK: API Route - Get All Tutors
// Handles GET requests to fetch all tutors from the database

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getAllTutors } from "@/services/tutorService";
import { apiLogger } from "@/lib/logger";

// BLOCK: GET Handler Function
export async function GET() {
  try {
    // BLOCK: Fetch all tutors using service
    apiLogger.info("GET /api/tutors - Fetching all tutors");
    const tutors = await getAllTutors();
    apiLogger.success(`Fetched ${tutors.length} tutors successfully`);

    // BLOCK: Success response
    return NextResponse.json(tutors, { status: 200 });
  } catch (error) {
    // BLOCK: Error handling
    apiLogger.error("Error fetching tutors:", error);

    return new NextResponse("Internal server error", { status: 500 });
  }
}
