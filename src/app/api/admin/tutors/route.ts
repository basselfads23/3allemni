// src/app/api/admin/tutors/route.ts
// BLOCK: Admin API Route - List Tutors
// Fetches all tutors with user and education data for admin review

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { apiLogger } from "@/lib/logger";

// BLOCK: GET Handler Function
export async function GET(req: NextRequest) {
  apiLogger.info("GET /api/admin/tutors - Admin request received");

  try {
    // 1. Authenticate session and check ADMIN role
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      apiLogger.error("Unauthorized admin access attempt");
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // 2. Fetch all tutors with associated data
    const tutors = await prisma.tutor.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
          }
        },
        educations: {
          orderBy: { createdAt: "desc" }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    apiLogger.success(`Admin fetched ${tutors.length} tutors for review`);
    return NextResponse.json(tutors, { status: 200 });

  } catch (error) {
    apiLogger.error("Error in GET /api/admin/tutors:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
