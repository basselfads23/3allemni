// src/app/api/tutor/profile/route.ts
// API route to get the current authenticated user's tutor profile

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Get authenticated session
    const session = await auth();

    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Find tutor profile for this user
    const tutor = await prisma.tutor.findUnique({
      where: {
        userId: session.user.id,
      },
    });

    if (!tutor) {
      return new NextResponse("Tutor profile not found", { status: 404 });
    }

    return NextResponse.json(tutor, { status: 200 });
  } catch (error) {
    console.error("Error fetching tutor profile:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
