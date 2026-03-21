// src/app/api/admin/users/route.ts
// BLOCK: Admin API Route - List Users
// Fetches all users for admin management

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { apiLogger } from "@/lib/logger";

// BLOCK: GET Handler Function
export async function GET(req: NextRequest) {
  try {
    // 1. Authenticate session and check ADMIN role
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // 2. Fetch all users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(users, { status: 200 });

  } catch (error) {
    apiLogger.error("Error in GET /api/admin/users:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
