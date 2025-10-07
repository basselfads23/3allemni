// src/app/api/tutors/route.ts
// BLOCK: API Route - Get All Tutors
// This API route handles GET requests to fetch all tutors from the database
// Route URL: /api/tutors
// Method: GET
// Request body: None
// Response: Returns array of tutor objects with 200, or error message with 500

// CRITICAL: Force Node.js runtime (Prisma doesn't work in Edge runtime)
export const runtime = "nodejs"; // Tells Next.js to use Node.js runtime instead of Edge
export const dynamic = "force-dynamic"; // Disable static optimization for this route

// Import Next.js server response helper for API routes
import { NextResponse } from "next/server"; // NextResponse: helper for creating HTTP responses (no NextRequest needed for GET without params)

// Import Prisma client instance to interact with database
import { prisma } from "@/lib/prisma"; // @/ is path alias for src/, prisma is singleton client instance

// BLOCK: GET Handler Function
// Export async function to handle GET requests to /api/tutors endpoint
export async function GET() {
  // export: makes function available to Next.js router
  // async: allows using await for asynchronous operations
  // GET: function name must match HTTP method
  // No parameters: GET requests don't need request body parsing

  try {
    // try-catch block: handles errors gracefully and prevents crashes

    // BLOCK: Database operation - Fetch all tutors
    // Fetch all tutor records from Neon database using Prisma
    const tutors = await prisma.tutor.findMany();
    // await: waits for database operation to complete
    // prisma.tutor: accesses Tutor model from schema
    // .findMany(): Prisma method to retrieve all records from Tutor table
    // Returns array of tutor objects: [{ id: 1, name: "John", subject: "Math" }, ...]

    // BLOCK: Success response
    // Return tutors array as JSON with success status
    return NextResponse.json(tutors, { status: 200 });
    // NextResponse.json(): creates JSON response
    // tutors: array of tutor objects to serialize to JSON
    // status: 200 means OK (success)
  } catch (error) {
    // catch block: executes if any error occurs in try block (database connection error, etc.)

    // BLOCK: Error handling
    // Log error details to server console for debugging
    console.error(error); // console.error(): prints error to terminal/console with error formatting

    // Return generic error response to client
    return new NextResponse("Internal server error", { status: 500 });
    // new NextResponse(): creates HTTP response
    // First argument: response body (error message string)
    // status: 500 means Internal Server Error (server-side error)
    // Generic message prevents exposing sensitive error details to client
  }
}
// This route fetches all tutors from Neon database via Prisma and returns them as JSON array for display on student page
