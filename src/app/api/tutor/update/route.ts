// src/app/api/tutor/update/route.ts
// API route to update the current authenticated user's tutor profile

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { tutorSchema } from "@/lib/validations";
import { put } from "@vercel/blob";

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await auth();

    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    console.log("🟢 [API] Updating tutor profile for user:", session.user.email);

    // Parse FormData
    const formData = await req.formData();

    // Extract fields
    const name = formData.get("name") as string;
    const subject = formData.get("subject") as string;
    const bio = formData.get("bio") as string;
    const priceString = formData.get("price") as string | null;
    const locationString = formData.get("location") as string | null;
    const profilePictureFile = formData.get("profilePicture") as File | null;

    // Convert and prepare data
    const price =
      priceString && priceString !== "" ? parseFloat(priceString) : undefined;
    const location =
      locationString && locationString !== "" ? locationString : undefined;

    // Validate data
    const validation = tutorSchema.safeParse({
      name,
      subject,
      bio,
      price,
      location,
    });

    if (!validation.success) {
      const firstError = validation.error.issues[0];
      const errorMessage = `${firstError.path.join(".")}: ${firstError.message}`;
      return new NextResponse(JSON.stringify({ error: errorMessage }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const validatedData = validation.data;

    // Handle profile picture upload if provided
    let profilePictureUrl: string | undefined = undefined;

    if (profilePictureFile && profilePictureFile.size > 0) {
      console.log("🔵 [API] Uploading new profile picture to Vercel Blob...");
      const blob = await put(profilePictureFile.name, profilePictureFile, {
        access: "public",
      });
      profilePictureUrl = blob.url;
      console.log("🟢 [API] Profile picture uploaded:", profilePictureUrl);
    }

    // Update tutor record
    const updateData: any = {
      name: validatedData.name,
      subject: validatedData.subject,
      bio: validatedData.bio,
      price: validatedData.price,
      location: validatedData.location,
    };

    // Only update profile picture if a new one was uploaded
    if (profilePictureUrl) {
      updateData.profilePictureUrl = profilePictureUrl;
    }

    const tutor = await prisma.tutor.update({
      where: {
        userId: session.user.id,
      },
      data: updateData,
    });

    console.log("🟢 [API] Tutor profile updated successfully");

    return NextResponse.json(tutor, { status: 200 });
  } catch (error) {
    console.error("🔴 [API] Error updating tutor profile:", error);
    return new NextResponse(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
