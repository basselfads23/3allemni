// src/app/messages/page.tsx
import { auth } from "@/lib/auth";
import { getConversationsForUser } from "@/services/messagingService";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";

export default async function MessagesPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/api/auth/signin");
  }

  const userId = session.user.id;
  const role = session.user.role as "PARENT" | "TUTOR";
  
  const conversations = await getConversationsForUser(userId, role);

  return (
    <main className="page-container">
      <div className="content-wrapper-narrow">
        <h1 className="page-title-sm mb-8">Messages</h1>

        {conversations.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-700">Your inbox is empty</h2>
            <p className="text-gray-500 mt-2">
              {role === "PARENT" 
                ? "Start a conversation by visiting a tutor's profile." 
                : "Your tutoring requests will appear here."}
            </p>
            {role === "PARENT" && (
              <Link href="/parent" className="form-button inline-block mt-6 px-8">
                Browse Tutors
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {conversations.map((conv) => {
              const partner = role === "PARENT" ? conv.tutor.user : conv.parent;
              const latestMessage = conv.messages[0];
              const isPending = conv.status === "PENDING";
              const isAccepted = conv.status === "ACCEPTED";

              return (
                <Link 
                  key={conv.id} 
                  href={`/messages/${conv.id}`}
                  className="block card p-4 hover:shadow-md transition-shadow border border-gray-100"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      {partner.image ? (
                        <div className="relative w-12 h-12 flex-shrink-0">
                          <Image 
                            src={partner.image} 
                            alt={partner.name || ""} 
                            fill
                            className="rounded-full object-cover" 
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold flex-shrink-0">
                          {(partner.name || "U")[0]}
                        </div>
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-gray-900 truncate">
                            {partner.name || "User"}
                          </h3>
                          <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full ${
                            isPending ? "bg-yellow-100 text-yellow-700 border border-yellow-200" :
                            isAccepted ? "bg-green-100 text-green-700 border border-green-200" :
                            "bg-red-100 text-red-700 border border-red-200"
                          }`}>
                            {conv.status}
                          </span>
                        </div>
                        
                        <p className="text-sm text-gray-600 truncate italic">
                          {latestMessage?.content || "No messages yet"}
                        </p>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <p className="text-xs text-gray-400">
                        {formatDistanceToNow(new Date(conv.updatedAt), { addSuffix: true })}
                      </p>
                      {latestMessage && !latestMessage.isRead && latestMessage.senderId !== userId && (
                        <div className="mt-2 inline-block w-2.5 h-2.5 bg-blue-600 rounded-full"></div>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
