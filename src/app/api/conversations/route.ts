// src/app/api/conversations/route.ts
// BLOCK: API Route - Conversations
// Handles listing and creating conversations

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { 
  createConversation, 
  getConversationsForUser 
} from "@/services/messagingService";
import { apiLogger } from "@/lib/logger";

// BLOCK: GET Handler
// Lists all conversations for the current user
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

    const userId = session.user.id;
    const role = session.user.role;

    // Only PARENT and TUTOR users have conversations
    if (role !== "PARENT" && role !== "TUTOR") {
      return NextResponse.json([], { status: 200 });
    }

    const conversations = await getConversationsForUser(userId, role);
    return NextResponse.json(conversations, { status: 200 });
  } catch (error) {
    apiLogger.error("Error in GET /api/conversations:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

// BLOCK: POST Handler
// Starts a new conversation (Parent only)
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

    // Only PARENT users can initiate conversations
    if (session.user.role !== "PARENT") {
      return new NextResponse("Forbidden: Only parents can start conversations", { status: 403 });
    }

    const body = await req.json();
    const { tutorId, initialMessage } = body;

    const trimmedMessage = typeof initialMessage === "string" ? initialMessage.trim() : "";

    if (!tutorId || !trimmedMessage) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const conversation = await createConversation(
      session.user.id,
      tutorId,
      trimmedMessage
    );

    return NextResponse.json(conversation, { status: 201 });
  } catch (error) {
    apiLogger.error("Error in POST /api/conversations:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return new NextResponse(message, { status: 500 });
  }
}
