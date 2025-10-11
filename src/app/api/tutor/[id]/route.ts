// src/app/api/tutor/[id]/route.ts
// BLOCK: API Route - Get Single Tutor by ID
// This API route handles GET requests to fetch a single tutor from the database
// Route URL: /api/tutor/[id] where [id] is a dynamic parameter
// Method: GET
// Response: Returns tutor object with 200, or error message with 404/500

// CRITICAL: Force Node.js runtime (Prisma doesn't work in Edge runtime)
export const runtime = "nodejs"; // Tells Next.js to use Node.js runtime instead of Edge
export const dynamic = "force-dynamic"; // Disable static optimization for this route

// Import Next.js server types for API routes
import { NextRequest, NextResponse } from "next/server"; // NextRequest: typed request object, NextResponse: helper for creating responses

// Import Prisma client instance to interact with database
import { prisma } from "@/lib/prisma"; // @/ is path alias for src/, prisma is singleton client instance

// BLOCK: GET Handler Function
// Export async function to handle GET requests to /api/tutor/[id] endpoint
// The context parameter contains the dynamic route parameters
export async function GET(
  req: NextRequest, // The request object (not used in this endpoint, but required by Next.js)
  context: { params: Promise<{ id: string }> } // context.params is now a Promise in Next.js 15+
) {
  // context.params: Promise that resolves to object containing dynamic route parameters
  // Must be awaited before accessing properties (Next.js 15+ requirement)

  // DEBUG: Log that function was called
  console.log("🔵 [API] GET /api/tutor/[id] - Function called");

  try {
    // try-catch block: handles errors gracefully and prevents crashes

    // BLOCK: Await and extract ID from URL parameters
    // In Next.js 15+, params must be awaited before accessing properties
    const params = await context.params; // await: waits for params Promise to resolve
    const { id } = params; // Destructure id from resolved params object
    console.log("🔵 [API] Tutor ID from URL:", id);

    // BLOCK: Convert ID to number
    // Convert ID string to number (database IDs are integers)
    const tutorId = parseInt(id, 10); // parseInt(string, radix): converts string to integer
    // First argument: the string to convert
    // Second argument (10): base 10 (decimal number system)
    console.log("🔵 [API] Converted tutor ID to number:", tutorId);

    // BLOCK: Validate ID is a valid number
    // Check if conversion resulted in a valid number
    if (isNaN(tutorId)) {
      // isNaN(): returns true if value is Not a Number
      console.log("🔴 [API] Invalid ID - not a number");
      return new NextResponse("Invalid tutor ID", { status: 400 });
      // status: 400 means Bad Request (client sent invalid data)
    }

    // BLOCK: Database operation - Find tutor by ID
    // Query database to find tutor with matching ID
    console.log("🔵 [API] Querying database for tutor with ID:", tutorId);
    const tutor = await prisma.tutor.findUnique({
      // await: waits for database operation to complete
      // prisma.tutor: accesses Tutor model from schema
      // .findUnique(): Prisma method to find a single record by unique field
      where: {
        // where clause: specifies which record to find
        id: tutorId, // Find tutor where id field matches tutorId
      },
    });
    // Returns tutor object if found, or null if not found

    // BLOCK: Handle tutor not found
    // Check if tutor exists in database
    if (!tutor) {
      // !tutor: true if tutor is null (not found)
      console.log("🔴 [API] Tutor not found with ID:", tutorId);
      return new NextResponse("Tutor not found", { status: 404 });
      // status: 404 means Not Found (resource doesn't exist)
    }

    console.log("🟢 [API] Tutor found successfully:", tutor);

    // BLOCK: Success response
    // Return the tutor as JSON with success status
    return NextResponse.json(tutor, { status: 200 });
    // NextResponse.json(): creates JSON response
    // tutor: JavaScript object to serialize to JSON
    // status: 200 means OK (success)
  } catch (error) {
    // catch block: executes if any error occurs in try block (database error, parsing error, etc.)

    // BLOCK: Error handling
    // Log detailed error information for debugging
    console.error("🔴 [API] Error occurred:");
    console.error("🔴 [API] Error message:", (error as Error).message);
    console.error("🔴 [API] Full error object:", error);

    // Return generic error message
    return new NextResponse("Internal server error", { status: 500 });
    // status: 500 means Internal Server Error (server-side error)
  }
}
// This route receives a tutor ID from the URL, queries the database, and returns that tutor's data or an error
