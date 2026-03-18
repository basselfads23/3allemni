// src/app/api/submit/route.ts
// BLOCK: API Route - Submit Tutor
// Handles POST requests to submit new tutors or update existing ones

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { tutorSchema } from "@/lib/validations";
import { createTutor, updateTutor, getTutorByUserId } from "@/services/tutorService";
import { uploadProfilePicture } from "@/services/uploadService";
import { apiLogger } from "@/lib/logger";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// BLOCK: POST Handler Function
export async function POST(req: NextRequest) {
  apiLogger.info("POST /api/submit - Starting tutor submission process");

  try {
    // 1. Authenticate user
    const session = await auth();
    if (!session?.user?.email) {
      apiLogger.error("Unauthorized: No session email found");
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // 2. Resolve User ID (robust check)
    let userId = session.user.id as string;
    if (!userId) {
      apiLogger.info(`User ID missing from session for ${session.user.email}, fetching from DB`);
      const dbUser = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true }
      });
      if (!dbUser) {
        apiLogger.error(`User not found in database for email: ${session.user.email}`);
        return new NextResponse("User not found", { status: 404 });
      }
      userId = dbUser.id;
    }

    // 3. Parse FormData
    apiLogger.info("Parsing FormData from request...");
    const formData = await req.formData();
    
    // Extract fields
    const name = formData.get("name") as string;
    const subject = formData.get("subject") as string;
    const bio = formData.get("bio") as string;
    const hourlyRateStr = formData.get("hourlyRate") as string | null;
    const teachingModeStr = formData.get("teachingMode") as string;
    const governorate = formData.get("governorate") as string;
    const district = formData.get("district") as string;
    const city = formData.get("city") as string;
    const email = formData.get("email") as string;
    const phoneNumber = formData.get("phoneNumber") as string;
    const profilePictureFile = formData.get("profilePicture") as File | null;

    const hourlyRate = hourlyRateStr ? parseFloat(hourlyRateStr) : undefined;

    const rawData = {
      name,
      subject,
      bio,
      hourlyRate,
      teachingMode: teachingModeStr,
      governorate,
      district,
      city,
      email,
      phoneNumber,
    };

    apiLogger.info("Extracted raw data for validation");

    // 4. Validate with Zod
    const validation = tutorSchema.safeParse(rawData);

    if (!validation.success) {
      apiLogger.error("Validation failed:", validation.error.format());
      return NextResponse.json({ 
        error: "Validation failed", 
        details: validation.error.format() 
      }, { status: 400 });
    }

    const validatedData = validation.data;

    // 5. Handle profile picture upload
    let profilePictureUrl: string | undefined = undefined;
    if (profilePictureFile && profilePictureFile.size > 0) {
      apiLogger.info("Uploading profile picture...");
      try {
        profilePictureUrl = await uploadProfilePicture(profilePictureFile);
        apiLogger.success("Profile picture uploaded successfully");
      } catch (uploadError) {
        apiLogger.error("Profile picture upload failed:", uploadError);
        // Continue without picture or return error? Let's continue for now.
      }
    }

    // 6. Check for existing tutor profile
    apiLogger.info(`Checking for existing tutor profile for userId: ${userId}`);
    const existingTutor = await getTutorByUserId(userId);

    let tutor;
    if (existingTutor) {
      apiLogger.info(`Updating existing tutor profile: ${existingTutor.id}`);
      tutor = await updateTutor(existingTutor.id, {
        ...validatedData,
        ...(profilePictureUrl && { profilePictureUrl }),
      });
    } else {
      apiLogger.info("Creating new tutor profile");
      tutor = await createTutor({
        ...validatedData,
        userId,
        profilePictureUrl,
      });
    }

    apiLogger.success(`Tutor profile processed successfully: ${tutor.id}`);
    return NextResponse.json(tutor, { status: 200 });

  } catch (error) {
    apiLogger.error("Error in /api/submit:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return new NextResponse(message, { status: 500 });
  }
}
