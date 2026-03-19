// src/components/messages/ChatUI.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { format } from "date-fns";
import { clientLogger } from "@/lib/logger";

type Message = {
  id: string;
  content: string;
  senderId: string;
  createdAt: Date;
  sender: {
    name: string | null;
  };
};

type Conversation = {
  id: string;
  status: "PENDING" | "ACCEPTED" | "DECLINED";
  messages: Message[];
};

type ChatUIProps = {
  conversation: Conversation;
  currentUserId: string;
  currentUserRole: "PARENT" | "TUTOR";
  partner: {
    id: string;
    name: string | null;
    image: string | null;
  };
};

export default function ChatUI({ 
  conversation, 
  currentUserId, 
  currentUserRole, 
  partner 
}: ChatUIProps) {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation.messages]);

  const handleStatusUpdate = async (status: "ACCEPTED" | "DECLINED") => {
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/conversations/${conversation.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        clientLogger.success(`Conversation ${status.toLowerCase()} successfully`);
        router.refresh();
      } else {
        alert("Failed to update status.");
      }
    } catch (err) {
      clientLogger.error("Error updating status:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/conversations/${conversation.id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: content.trim() }),
      });

      if (res.ok) {
        setContent("");
        router.refresh();
      } else {
        const errText = await res.text();
        alert(errText || "Failed to send message.");
      }
    } catch (err) {
      clientLogger.error("Error sending message:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isPending = conversation.status === "PENDING";
  const isAccepted = conversation.status === "ACCEPTED";
  const isDeclined = conversation.status === "DECLINED";

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center gap-3">
        {partner.image ? (
          <div className="relative w-10 h-10">
            <Image src={partner.image} alt={partner.name || ""} fill className="rounded-full object-cover" />
          </div>
        ) : (
          <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
            {(partner.name || "U")[0]}
          </div>
        )}
        <div>
          <h2 className="font-bold text-gray-900 leading-tight">{partner.name || "User"}</h2>
          <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${isAccepted ? "bg-green-500" : isPending ? "bg-yellow-500" : "bg-red-500"}`}></span>
            <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">{conversation.status}</span>
          </div>
        </div>
      </div>

      {/* Message Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/30">
        {conversation.messages.map((msg: Message) => {
          const isMe = msg.senderId === currentUserId;
          return (
            <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] px-4 py-2 rounded-2xl shadow-sm ${
                isMe 
                  ? "bg-blue-600 text-white rounded-tr-none" 
                  : "bg-white text-gray-800 border border-gray-100 rounded-tl-none"
              }`}>
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                <p className={`text-[10px] mt-1 text-right ${isMe ? "text-blue-100" : "text-gray-400"}`}>
                  {format(new Date(msg.createdAt), "h:mm a")}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Action Area */}
      <div className="p-4 border-t border-gray-100 bg-white">
        {isPending && currentUserRole === "TUTOR" && (
          <div className="space-y-3">
            <p className="text-sm text-center text-gray-600 mb-2">New tutoring request received. Accept to start chatting!</p>
            <div className="flex gap-3">
              <button 
                onClick={() => handleStatusUpdate("ACCEPTED")}
                disabled={isSubmitting}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 rounded-lg transition-colors disabled:opacity-50"
              >
                Accept Request
              </button>
              <button 
                onClick={() => handleStatusUpdate("DECLINED")}
                disabled={isSubmitting}
                className="flex-1 bg-white border border-red-200 text-red-600 hover:bg-red-50 font-bold py-2.5 rounded-lg transition-colors disabled:opacity-50"
              >
                Decline
              </button>
            </div>
          </div>
        )}

        {isPending && currentUserRole === "PARENT" && (
          <div className="p-3 bg-yellow-50 border border-yellow-100 rounded-lg text-center">
            <p className="text-sm text-yellow-800 font-medium italic">
              Waiting for the tutor to accept your request before you can send more messages.
            </p>
          </div>
        )}

        {isAccepted && (
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input 
              type="text" 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 form-input py-2.5"
              disabled={isSubmitting}
            />
            <button 
              type="submit"
              disabled={isSubmitting || !content.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-lg transition-colors disabled:opacity-50 flex-shrink-0"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </form>
        )}

        {isDeclined && (
          <div className="p-3 bg-gray-100 border border-gray-200 rounded-lg text-center">
            <p className="text-sm text-gray-600 font-medium italic">
              This conversation has been closed.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
