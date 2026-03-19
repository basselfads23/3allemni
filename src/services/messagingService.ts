// src/services/messagingService.ts
// BLOCK: Messaging Service
// Core business logic for the internal chat system

import { prisma } from "@/lib/prisma";
import { serviceLogger } from "@/lib/logger";
import { ConversationStatus } from "@prisma/client";

// BLOCK: Create initial conversation
// Creates a conversation and its first message in a single transaction
export async function createConversation(
  parentId: string,
  tutorId: string,
  initialMessage: string
) {
  try {
    serviceLogger.info(`Creating conversation between Parent: ${parentId} and Tutor: ${tutorId}`);

    const conversation = await prisma.$transaction(async (tx) => {
      // 1. Create the conversation record
      const conv = await tx.conversation.create({
        data: {
          parentId,
          tutorId,
          status: ConversationStatus.PENDING,
          messages: {
            create: {
              senderId: parentId,
              content: initialMessage,
            },
          },
        },
        include: {
          messages: true,
        },
      });

      return conv;
    });

    serviceLogger.success(`Conversation ${conversation.id} created successfully`);
    return conversation;
  } catch (error) {
    serviceLogger.error("Error creating conversation:", error);
    throw new Error("Failed to start conversation");
  }
}

// BLOCK: Get conversations for a user
// Fetches list of conversations based on user role
export async function getConversationsForUser(userId: string, role: "PARENT" | "TUTOR") {
  try {
    serviceLogger.info(`Fetching conversations for user: ${userId} with role: ${role}`);

    const conversations = await prisma.conversation.findMany({
      where: role === "PARENT" 
        ? { parentId: userId } 
        : { tutor: { userId: userId } },
      include: {
        parent: {
          select: {
            id: true,
            name: true,
            image: true,
          }
        },
        tutor: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              }
            }
          }
        },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1, // Only get the latest message for preview
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    return conversations;
  } catch (error) {
    serviceLogger.error(`Error fetching conversations for user ${userId}:`, error);
    throw new Error("Failed to load conversations");
  }
}

// BLOCK: Get messages for a conversation
// Fetches full message history after verifying user participation
export async function getMessages(conversationId: string, userId: string) {
  try {
    // Verify user is part of the conversation
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: { tutor: true }
    });

    if (!conversation) throw new Error("Conversation not found");
    
    const isParticipant = 
      conversation.parentId === userId || 
      conversation.tutor.userId === userId;

    if (!isParticipant) {
      serviceLogger.error(`Unauthorized message access attempt by user ${userId} on conversation ${conversationId}`);
      throw new Error("Unauthorized access to conversation");
    }

    const messages = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: "asc" },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
          }
        }
      }
    });

    // Mark messages as read for the receiver
    await prisma.message.updateMany({
      where: {
        conversationId,
        senderId: { not: userId },
        isRead: false,
      },
      data: { isRead: true },
    });

    return messages;
  } catch (error) {
    serviceLogger.error(`Error fetching messages for conversation ${conversationId}:`, error);
    throw error;
  }
}

// BLOCK: Send a message
// Adds a message to a conversation with business rule validation
export async function sendMessage(conversationId: string, senderId: string, content: string) {
  try {
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: { 
        tutor: true,
        _count: { select: { messages: true } }
      }
    });

    if (!conversation) throw new Error("Conversation not found");

    // Rule 1: Cannot send to declined conversations
    if (conversation.status === ConversationStatus.DECLINED) {
      throw new Error("Cannot send messages to a declined conversation");
    }

    // Rule 2: Parent cannot send more than one message if status is PENDING
    if (
      conversation.status === ConversationStatus.PENDING && 
      senderId === conversation.parentId &&
      conversation._count.messages >= 1
    ) {
      throw new Error("You must wait for the tutor to accept your request before sending more messages.");
    }

    const message = await prisma.$transaction(async (tx) => {
      const msg = await tx.message.create({
        data: {
          conversationId,
          senderId,
          content,
        }
      });

      // Update the conversation's updatedAt timestamp
      await tx.conversation.update({
        where: { id: conversationId },
        data: { updatedAt: new Date() }
      });

      return msg;
    });

    return message;
  } catch (error) {
    serviceLogger.error(`Error sending message in conversation ${conversationId}:`, error);
    throw error;
  }
}

// BLOCK: Update conversation status
// Allows tutors to accept or decline a request
export async function updateConversationStatus(
  conversationId: string, 
  userId: string, // tutor's userId
  status: ConversationStatus
) {
  try {
    // Verify user is the tutor of this conversation
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: { tutor: true }
    });

    if (!conversation) throw new Error("Conversation not found");
    if (conversation.tutor.userId !== userId) {
      throw new Error("Only the tutor can change the conversation status");
    }

    const updated = await prisma.conversation.update({
      where: { id: conversationId },
      data: { status },
    });

    serviceLogger.success(`Conversation ${conversationId} status updated to ${status}`);
    return updated;
  } catch (error) {
    serviceLogger.error(`Error updating status for conversation ${conversationId}:`, error);
    throw error;
  }
}
