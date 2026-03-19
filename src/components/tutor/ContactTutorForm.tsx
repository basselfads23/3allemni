// src/components/tutor/ContactTutorForm.tsx
"use client";

import { useState } from "react";
import { clientLogger } from "@/lib/logger";

type ContactTutorFormProps = {
  tutorId: string;
  tutorName: string;
};

export default function ContactTutorForm({ tutorId, tutorName }: ContactTutorFormProps) {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tutorId,
          initialMessage: message.trim(),
        }),
      });

      if (res.ok) {
        setIsSuccess(true);
        clientLogger.success(`Initial message sent to tutor: ${tutorName}`);
      } else {
        const errorText = await res.text();
        setError(errorText || "Failed to send message.");
        clientLogger.error("Error starting conversation:", errorText);
      }
    } catch (err) {
      setError("An unexpected error occurred.");
      clientLogger.error("Fetch error in ContactTutorForm:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="card bg-green-50 border border-green-200 p-6 text-center">
        <h3 className="text-lg font-bold text-green-800 mb-2">Message Sent!</h3>
        <p className="text-green-700">
          Your request has been sent to <strong>{tutorName}</strong>. 
          You will be able to continue the chat once they accept your request.
        </p>
        <button 
          onClick={() => window.location.href = "/messages"}
          className="mt-4 text-green-800 font-semibold underline hover:text-green-900"
        >
          View your messages
        </button>
      </div>
    );
  }

  return (
    <div className="card p-6 shadow-sm border border-gray-100">
      <h3 className="text-xl font-bold mb-4">Contact {tutorName}</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="initialMessage" className="form-label">
            Your Message
          </label>
          <textarea
            id="initialMessage"
            rows={4}
            className="form-input w-full"
            placeholder={`Hi ${tutorName}, I am looking for a tutor for...`}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        {error && (
          <div className="p-3 rounded bg-red-50 text-red-700 border border-red-100 text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || !message.trim()}
          className="form-button w-full flex justify-center items-center gap-2"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Sending...
            </>
          ) : (
            "Send Message"
          )}
        </button>
      </form>
    </div>
  );
}
