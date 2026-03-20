// src/app/api/user/settings/route.ts
// BLOCK: API Route - User Settings
// Handles PATCH requests to update user account settings

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { userSettingsSchema, tutorSchema } from "@/lib/validations";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { apiLogger } from "@/lib/logger";
import { createTutor, updateTutor, getTutorByUserId } from "@/services/tutorService";

// BLOCK: PATCH Handler Function
export async function PATCH(req: NextRequest) {
  apiLogger.info("PATCH /api/user/settings - Starting update process");

  try {
    // 1. Authenticate user
    const session = await auth();
    if (!session?.user?.id) {
      apiLogger.error("Unauthorized: No session user ID found");
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const userId = session.user.id;

    // 2. Parse and Validate body
    const body = await req.json();
    
    // Validate basic user settings
    const userValidation = userSettingsSchema.safeParse(body);
    if (!userValidation.success) {
      return NextResponse.json({ error: "Invalid user data", details: userValidation.error.format() }, { status: 400 });
    }

    const { name, phoneNumber, role } = userValidation.data;

    // 3. Update User in database
    apiLogger.info(`Updating user settings for ID: ${userId}`);
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        phoneNumber: phoneNumber || null,
        role,
      },
    });

    // 4. If role is TUTOR, handle Tutor profile
    if (role === "TUTOR") {
      const tutorValidation = tutorSchema.safeParse(body);
      if (!tutorValidation.success) {
        return NextResponse.json({ error: "Invalid tutor data", details: tutorValidation.error.format() }, { status: 400 });
      }

      const existingTutor = await getTutorByUserId(userId);
      if (existingTutor) {
        await updateTutor(existingTutor.id, tutorValidation.data);
      } else {
        await createTutor({
          ...tutorValidation.data,
          userId,
        });
      }
    }

    apiLogger.success(`User and Tutor settings updated successfully for ID: ${userId}`);
    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    apiLogger.error("Error in PATCH /api/user/settings:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return new NextResponse(message, { status: 500 });
  }
}
