// src/app/api/submit/route.ts
// BLOCK: API Route - Submit Tutor
// This API route handles POST requests to submit new tutors to the database
// Route URL: /api/submit
// Method: POST
// Request body: { name: string, subject: string }
// Response: Returns created tutor object with 200, or error message with 400/500

// CRITICAL: Force Node.js runtime (Prisma doesn't work in Edge runtime)
export const runtime = "nodejs"; // Tells Next.js to use Node.js runtime instead of Edge
export const dynamic = "force-dynamic"; // Disable static optimization for this route

// Import Next.js server types for API routes
import { NextRequest, NextResponse } from "next/server"; // NextRequest: typed request object, NextResponse: helper for creating responses

// Import Prisma client instance to interact with database
import { prisma } from "@/lib/prisma"; // @/ is path alias for src/, prisma is singleton client instance

// BLOCK: POST Handler Function
// Export async function to handle POST requests to /api/submit endpoint
export async function POST(req: NextRequest) {
  // export: makes function available to Next.js router
  // async: allows using await for asynchronous operations
  // POST: function name must match HTTP method
  // req: NextRequest object containing request data (headers, body, etc.)

  // DEBUG: Log that function was called
  console.log("🔵 [API] POST /api/submit - Function called");

  try {
    // try-catch block: handles errors gracefully and prevents crashes

    // BLOCK: Parse and extract request data
    // Parse JSON from request body
    console.log("🔵 [API] Parsing request body...");
    const body = await req.json(); // await: waits for JSON parsing to complete, req.json(): parses JSON string to JavaScript object
    console.log("🔵 [API] Request body parsed:", body);

    // Extract name and subject fields using destructuring
    const { name, email, subject, bio } = body; // Destructuring: extracts name and subject properties from body object into separate variables
    console.log(
      "🔵 [API] Extracted fields - name:",
      name,
      "email:",
      email,
      "subject:",
      subject,
      "bio:",
      bio
    );

    // BLOCK: Validate required fields
    // Check if both name and subject are provided
    if (!name || !subject || !email) {
      // !name: true if name is undefined, null, or empty string
      // ||: logical OR operator
      console.log("🔴 [API] Validation failed - missing fields");
      // Returns error response if validation fails
      return new NextResponse("Name, email, and subject are required", {
        status: 400,
      });
      // new NextResponse(): creates HTTP response
      // First argument: response body (error message string)
      // status: 400 means Bad Request (client error)
    }

    // BLOCK: Database operation - Create tutor record
    // Create new tutor record in Neon database using Prisma
    console.log("🔵 [API] Attempting to create tutor in database...");
    console.log("🔵 [API] DATABASE_URL exists:", !!process.env.DATABASE_URL);
    console.log(
      "🔵 [API] DATABASE_URL starts with:",
      process.env.DATABASE_URL?.substring(0, 20)
    );

    const tutor = await prisma.tutor.create({
      // await: waits for database operation to complete
      // prisma.tutor: accesses Tutor model from schema
      // .create(): Prisma method to insert new record

      data: {
        // data property: contains fields to insert into database
        name, // Shorthand for name: name (tutor's name from request)
        email,
        subject, // Shorthand for subject: subject (subject they teach from request)
        bio, // Shorthand for bio: bio (tutor's bio from request)
      },
    });
    // Returns created record with auto-generated id from database
    console.log("🟢 [API] Tutor created successfully:", tutor);

    // BLOCK: Success response
    // Return the created tutor as JSON with success status
    return NextResponse.json(tutor, { status: 200 });
    // NextResponse.json(): creates JSON response
    // tutor: JavaScript object to serialize to JSON
    // status: 200 means OK (success)
  } catch (error) {
    // catch block: executes if any error occurs in try block (database error, parsing error, etc.)

    // BLOCK: Error handling
    // Log detailed error information for debugging
    console.error("🔴 [API] Error occurred:");
    console.error("🔴 [API] Error name:", (error as Error).name);
    console.error("🔴 [API] Error message:", (error as Error).message);
    console.error("🔴 [API] Error stack:", (error as Error).stack);
    console.error("🔴 [API] Full error object:", error);

    // Return detailed error in development, generic in production
    const errorMessage =
      process.env.NODE_ENV === "development"
        ? `Error: ${(error as Error).message}`
        : "Internal server error";

    return new NextResponse(errorMessage, { status: 500 });
    // status: 500 means Internal Server Error (server-side error)
  }
}
// This route receives tutor data from form, validates it, saves to Neon database via Prisma, and returns saved record or error
