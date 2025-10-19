// src/app/api/submit/route.ts
// BLOCK: API Route - Submit Tutor
// Handles POST requests to submit new tutors to the database

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { tutorSchema } from "@/lib/validations";
import { createTutor } from "@/services/tutorService";
import { uploadProfilePicture } from "@/services/uploadService";
import { apiLogger } from "@/lib/logger";

// BLOCK: POST Handler Function
export async function POST(req: NextRequest) {
  apiLogger.info("POST /api/submit - Function called");

  try {
    // BLOCK: Parse FormData
    apiLogger.info("Parsing FormData from request...");
    const formData = await req.formData();
    apiLogger.success("FormData parsed successfully");

    // Extract fields from FormData
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const subject = formData.get("subject") as string;
    const bio = formData.get("bio") as string;
    const priceString = formData.get("price") as string | null;
    const locationString = formData.get("location") as string | null;
    const profilePictureFile = formData.get("profilePicture") as File | null;

    // Convert price to number if provided
    const price =
      priceString && priceString !== "" ? parseFloat(priceString) : undefined;

    // Convert location to undefined if empty
    const location =
      locationString && locationString !== "" ? locationString : undefined;

    apiLogger.info("Extracted fields:", {
      name,
      email,
      subject,
      hasProfilePicture: !!profilePictureFile,
    });

    // BLOCK: Validate data with Zod
    apiLogger.info("Validating data with Zod...");
    const validation = tutorSchema.safeParse({
      name,
      email,
      subject,
      bio,
      price,
      location,
    });

    if (!validation.success) {
      apiLogger.error("Validation failed:", validation.error);
      const firstError = validation.error.issues[0];
      const errorMessage = `${firstError.path.join(".")}: ${
        firstError.message
      }`;
      apiLogger.error("Error message:", errorMessage);
      return new NextResponse(errorMessage, { status: 400 });
    }

    const validatedData = validation.data;
    apiLogger.success("Validation passed, data is valid");

    // BLOCK: Upload profile picture (if provided)
    let profilePictureUrl: string | undefined = undefined;

    if (profilePictureFile && profilePictureFile.size > 0) {
      apiLogger.info("Uploading profile picture...");
      profilePictureUrl = await uploadProfilePicture(profilePictureFile);
      apiLogger.success("Profile picture uploaded successfully");
    } else {
      apiLogger.info("No profile picture provided");
    }

    // BLOCK: Create tutor in database
    apiLogger.info("Creating tutor in database...");
    const tutor = await createTutor({
      ...validatedData,
      profilePictureUrl,
    });

    apiLogger.success("Tutor created successfully:", tutor.id);

    // BLOCK: Success response
    return NextResponse.json(tutor, { status: 200 });
  } catch (error) {
    // BLOCK: Error handling
    apiLogger.error("Error occurred:", (error as Error).message);
    apiLogger.error("Error stack:", (error as Error).stack);

    const errorMessage =
      process.env.NODE_ENV === "development"
        ? `Error: ${(error as Error).message}`
        : "Internal server error";

    return new NextResponse(errorMessage, { status: 500 });
  }
}
