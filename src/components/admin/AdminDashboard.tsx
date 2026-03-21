// src/components/admin/AdminDashboard.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { clientLogger } from "@/lib/logger";

type Education = {
  id: string;
  degree: string;
  major: string;
  university: string;
  documentUrl: string | null;
  isVerified: boolean;
};

type Tutor = {
  id: string;
  name: string;
  subject: string;
  user: {
    name: string | null;
    email: string;
  };
  educations: Education[];
};

export default function AdminDashboard() {
  const router = useRouter();
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    fetchTutors();
  }, []);

  const fetchTutors = async () => {
    try {
      const res = await fetch("/api/admin/tutors");
      if (res.ok) {
        const data = await res.json();
        setTutors(data);
      } else {
        clientLogger.error("Failed to fetch admin tutors");
      }
    } catch (err) {
      clientLogger.error("Error fetching tutors:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (educationId: string, isVerified: boolean) => {
    setProcessingId(educationId);
    try {
      const res = await fetch("/api/admin/verify", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ educationId, isVerified }),
      });

      if (res.ok) {
        // Update local state for immediate feedback
        setTutors(prev => prev.map(tutor => ({
          ...tutor,
          educations: tutor.educations.map(edu => 
            edu.id === educationId ? { ...edu, isVerified } : edu
          )
        })));
        clientLogger.success(`Education ${isVerified ? "verified" : "unverified"} successfully`);
        router.refresh();
      } else {
        alert("Failed to update verification status.");
      }
    } catch (err) {
      clientLogger.error("Error updating verification:", err);
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {tutors.length === 0 ? (
        <div className="card p-12 text-center text-gray-500">
          No tutor applications found.
        </div>
      ) : (
        <div className="grid gap-6">
          {tutors.map((tutor) => (
            <div key={tutor.id} className="card p-0 overflow-hidden border border-gray-200 shadow-sm">
              {/* Tutor Header */}
              <div className="bg-gray-50 p-4 border-b border-gray-200 flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{tutor.name}</h2>
                  <p className="text-sm text-gray-600">{tutor.user.email} • {tutor.subject}</p>
                </div>
                <span className="text-[10px] bg-white px-2 py-1 rounded border border-gray-200 font-mono text-gray-400">
                  ID: {tutor.id}
                </span>
              </div>

              {/* Educations List */}
              <div className="p-4 bg-white">
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Credentials</h3>
                
                {tutor.educations.length === 0 ? (
                  <p className="text-sm text-gray-500 italic">No educational documents uploaded yet.</p>
                ) : (
                  <div className="space-y-4">
                    {tutor.educations.map((edu) => (
                      <div key={edu.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg bg-gray-50 border border-gray-100 gap-4">
                        <div className="space-y-1">
                          <h4 className="font-bold text-gray-900">{edu.degree} in {edu.major}</h4>
                          <p className="text-sm text-gray-600">{edu.university}</p>
                          {edu.documentUrl ? (
                            <a 
                              href={edu.documentUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs font-bold text-purple-600 hover:text-purple-800 mt-2"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              VIEW DOCUMENT
                            </a>
                          ) : (
                            <span className="text-[10px] text-gray-400 block mt-2 italic">No file uploaded</span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          {edu.isVerified ? (
                            <div className="flex items-center gap-3">
                              <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full border border-green-200">
                                VERIFIED
                              </span>
                              <button
                                onClick={() => handleVerify(edu.id, false)}
                                disabled={processingId === edu.id}
                                className="text-xs text-gray-400 hover:text-red-600 transition-colors"
                              >
                                Revoke
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleVerify(edu.id, true)}
                              disabled={processingId === edu.id}
                              className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-6 py-2 rounded-lg transition-colors shadow-sm disabled:opacity-50"
                            >
                              {processingId === edu.id ? "Processing..." : "Verify Degree"}
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
