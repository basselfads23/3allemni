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
    const role = session.user.role as "PARENT" | "TUTOR";

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

    const body = await req.json();
    const { tutorId, initialMessage } = body;

    if (!tutorId || !initialMessage) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const conversation = await createConversation(
      session.user.id,
      tutorId,
      initialMessage
    );

    return NextResponse.json(conversation, { status: 201 });
  } catch (error) {
    apiLogger.error("Error in POST /api/conversations:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return new NextResponse(message, { status: 500 });
  }
}
