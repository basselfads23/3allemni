// src/app/api/submit/route.ts
// BLOCK: API Route - Submit Tutor
// This API route handles POST requests to submit new tutors to the database
// Route URL: /api/submit
// Method: POST
// Request body: { name: string, subject: string }
// Response: Returns created tutor object with 200, or error message with 400/500

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

  try {
    // try-catch block: handles errors gracefully and prevents crashes

    // BLOCK: Parse and extract request data
    // Parse JSON from request body
    const body = await req.json(); // await: waits for JSON parsing to complete, req.json(): parses JSON string to JavaScript object

    // Extract name and subject fields using destructuring
    const { name, subject } = body; // Destructuring: extracts name and subject properties from body object into separate variables

    // BLOCK: Validate required fields
    // Check if both name and subject are provided
    if (!name || !subject) {
      // !name: true if name is undefined, null, or empty string
      // ||: logical OR operator
      // Returns error response if validation fails
      return new NextResponse("Name and subject are required", { status: 400 });
      // new NextResponse(): creates HTTP response
      // First argument: response body (error message string)
      // status: 400 means Bad Request (client error)
    }

    // BLOCK: Database operation - Create tutor record
    // Create new tutor record in Neon database using Prisma
    const tutor = await prisma.tutor.create({
      // await: waits for database operation to complete
      // prisma.tutor: accesses Tutor model from schema
      // .create(): Prisma method to insert new record

      data: {
        // data property: contains fields to insert into database
        name, // Shorthand for name: name (tutor's name from request)
        subject, // Shorthand for subject: subject (subject they teach from request)
      },
    });
    // Returns created record with auto-generated id from database

    // BLOCK: Success response
    // Return the created tutor as JSON with success status
    return NextResponse.json(tutor, { status: 200 });
    // NextResponse.json(): creates JSON response
    // tutor: JavaScript object to serialize to JSON
    // status: 200 means OK (success)
  } catch (error) {
    // catch block: executes if any error occurs in try block (database error, parsing error, etc.)

    // BLOCK: Error handling
    // Log error details to server console for debugging
    console.error(error); // console.error(): prints error to terminal/console with error formatting

    // Return generic error response to client
    return new NextResponse("Internal server error", { status: 500 });
    // status: 500 means Internal Server Error (server-side error)
    // Generic message prevents exposing sensitive error details to client
  }
}
// This route receives tutor data from form, validates it, saves to Neon database via Prisma, and returns saved record or error
