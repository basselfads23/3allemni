// src/app/messages/[id]/page.tsx
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import ChatUI from "@/components/messages/ChatUI";
import Link from "next/link";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ConversationPage({ params }: PageProps) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/api/auth/signin");
  }

  const { id: conversationId } = await params;
  const userId = session.user.id;

  // 1. Fetch conversation with detailed relations
  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
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
        orderBy: { createdAt: "asc" },
        include: {
          sender: {
            select: {
              id: true,
              name: true,
            }
          }
        }
      }
    }
  });

  if (!conversation) {
    notFound();
  }

  // 2. Security Check: Is the user part of this chat?
  const isParent = conversation.parentId === userId;
  const isTutor = conversation.tutor.userId === userId;

  if (!isParent && !isTutor) {
    redirect("/messages");
  }

  // 3. Transform data for the Client Component
  // We want to easily know who the "partner" is
  const partner = isParent ? conversation.tutor.user : conversation.parent;
  
  // Also need to know if the current user is the tutor role in this specific chat
  const currentUserRole = isTutor ? "TUTOR" : "PARENT";

  return (
    <main className="page-container h-[calc(100vh-80px)] flex flex-col">
      <div className="content-wrapper-narrow flex flex-col h-full">
        <div className="flex items-center gap-4 mb-4">
          <Link href="/messages" className="text-blue-600 hover:text-blue-800 flex items-center gap-1 font-medium">
            ← <span className="hidden sm:inline">Back to Messages</span>
          </Link>
        </div>

        <ChatUI 
          conversation={conversation} 
          currentUserId={userId}
          currentUserRole={currentUserRole}
          partner={partner}
        />
      </div>
    </main>
  );
}
