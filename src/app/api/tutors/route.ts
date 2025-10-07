// This API route handles GET requests to fetch all tutors
import { NextResponse } from "next/server";  // Next.js API types
import { prisma } from "@/lib/prisma";  // Import Prisma client instance

// Export async function to handle GET requests to /api/tutors
export async function GET() {
  try {
    // Fetch all tutor records from database using Prisma
    const tutors = await prisma.tutor.findMany();
    // prisma.tutor.findMany() retrieves all rows from the Tutor table

    return NextResponse.json(tutors, { status: 200 });  // Return tutors array with 200 OK
  } catch (error) {
    console.error(error);  // Log error to console
    return new NextResponse("Internal server error", { status: 500 });  // Return 500 Server Error
  }
}
// This route fetches all tutors from Neon database and returns them as JSON