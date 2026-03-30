// src/app/api/conversations/[id]/messages/route.ts
// BLOCK: API Route - Conversation Messages
// Handles fetching and sending messages for a specific conversation

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getMessages, sendMessage } from "@/services/messagingService";
import { apiLogger } from "@/lib/logger";

// BLOCK: GET Handler
// Fetches full message history
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

    const { id: conversationId } = await context.params;

    const messages = await getMessages(conversationId, session.user.id);
    return NextResponse.json(messages, { status: 200 });
  } catch (error) {
    apiLogger.error("Error in GET /api/conversations/[id]/messages:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return new NextResponse(message, { status: 500 });
  }
}

// BLOCK: POST Handler
// Sends a new message
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

    const { id: conversationId } = await context.params;
    const { content } = await req.json();

    const trimmedContent = typeof content === "string" ? content.trim() : "";
    if (!trimmedContent) {
      return new NextResponse("Message content is required", { status: 400 });
    }

    const message = await sendMessage(conversationId, session.user.id, trimmedContent);
    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    apiLogger.error("Error in POST /api/conversations/[id]/messages:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return new NextResponse(message, { status: 500 });
  }
}
