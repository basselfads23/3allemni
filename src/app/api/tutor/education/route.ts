// src/app/api/tutor/education/route.ts
// BLOCK: API Route - Add Education
// Handles POST requests to add educational background for tutors

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { educationSchema } from "@/lib/validations";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { apiLogger } from "@/lib/logger";

// BLOCK: POST Handler Function
export async function POST(req: NextRequest) {
  apiLogger.info("POST /api/tutor/education - Function called");

  try {
    // 1. Authenticate session
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // 2. Verify user is a Tutor
    if (session.user.role !== "TUTOR") {
      return new NextResponse("Forbidden: Only tutors can add education records", { status: 403 });
    }

    // 3. Find the associated Tutor record
    const tutor = await prisma.tutor.findUnique({
      where: { userId: session.user.id },
    });

    if (!tutor) {
      return new NextResponse("Tutor profile not found. Please create a profile first.", { status: 404 });
    }

    // 4. Parse and Validate body
    const body = await req.json();
    const { documentUrl, ...rest } = body;
    
    const validation = educationSchema.safeParse(rest);

    if (!validation.success) {
      apiLogger.error("Validation failed:", validation.error.format());
      return NextResponse.json({ 
        error: "Validation failed", 
        details: validation.error.format() 
      }, { status: 400 });
    }

    // 5. Create Education record
    apiLogger.info(`Adding education for tutor: ${tutor.id}`);
    const education = await prisma.education.create({
      data: {
        tutorId: tutor.id,
        degree: validation.data.degree,
        major: validation.data.major,
        university: validation.data.university,
        documentUrl: documentUrl || null,
        isVerified: false, // Default to pending
      },
    });

    apiLogger.success(`Education record created: ${education.id}`);
    return NextResponse.json(education, { status: 201 });

  } catch (error) {
    apiLogger.error("Error in POST /api/tutor/education:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return new NextResponse(message, { status: 500 });
  }
}
