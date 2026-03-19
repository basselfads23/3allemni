// src/app/api/conversations/[id]/status/route.ts
// BLOCK: API Route - Conversation Status
// Handles updating conversation status (Tutor only)

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { updateConversationStatus } from "@/services/messagingService";
import { apiLogger } from "@/lib/logger";

// BLOCK: PATCH Handler
// Updates the status of a conversation (ACCEPTED | DECLINED)
export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

    const { id: conversationId } = await context.params;
    const { status } = await req.json();

    if (!status || !["ACCEPTED", "DECLINED"].includes(status)) {
      return new NextResponse("Invalid status value", { status: 400 });
    }

    const updated = await updateConversationStatus(
      conversationId,
      session.user.id,
      status
    );

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    apiLogger.error("Error in PATCH /api/conversations/[id]/status:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return new NextResponse(message, { status: 500 });
  }
}
