// This API route handles POST requests to submit new tutors
import { NextRequest, NextResponse } from "next/server";  // Next.js API types
import { prisma } from "@/lib/prisma";  // Import Prisma client instance

// Export async function to handle POST requests to /api/submit
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();  // Parse JSON from request body
    const { name, subject } = body;  // Extract name and subject fields

    // Validate that both fields are provided
    if (!name || !subject) {
      return new NextResponse("Name and subject are required", { status: 400 });  // Return 400 Bad Request
    }

    // Create new tutor record in database using Prisma
    const tutor = await prisma.tutor.create({
      data: {  // Data to insert
        name,     // Tutor's name
        subject,  // Subject they teach
      },
    });
    // prisma.tutor.create() inserts a new row into the Tutor table and returns the created record

    return NextResponse.json(tutor, { status: 200 });  // Return the created tutor with 200 OK
  } catch (error) {
    console.error(error);  // Log error to console
    return new NextResponse("Internal server error", { status: 500 });  // Return 500 Server Error
  }
}
// This route receives tutor data, validates it, saves it to Neon database, and returns the saved record
