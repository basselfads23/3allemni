// src/app/api/user/settings/route.ts
// BLOCK: API Route - User Settings
// Handles PATCH requests to update user account settings

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { userSettingsSchema } from "@/lib/validations";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { apiLogger } from "@/lib/logger";

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
    const validation = userSettingsSchema.safeParse(body);

    if (!validation.success) {
      apiLogger.error("Validation failed:", validation.error.format());
      return NextResponse.json({ 
        error: "Validation failed", 
        details: validation.error.format() 
      }, { status: 400 });
    }

    const { name, phoneNumber, role } = validation.data;

    // 3. Update User in database
    apiLogger.info(`Updating user settings for ID: ${userId}, Role: ${role}`);
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        phoneNumber: phoneNumber || null,
        role,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        role: true,
      }
    });

    apiLogger.success(`User settings updated successfully for ID: ${userId}`);
    return NextResponse.json(updatedUser, { status: 200 });

  } catch (error) {
    apiLogger.error("Error in PATCH /api/user/settings:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return new NextResponse(message, { status: 500 });
  }
}
