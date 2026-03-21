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

type User = {
  id: string;
  name: string | null;
  email: string;
  role: "ADMIN" | "TUTOR" | "PARENT" | "MASTER_ADMIN";
  createdAt: string;
};

type AdminDashboardProps = {
  currentUserId: string;
  currentUserRole: "ADMIN" | "MASTER_ADMIN";
};

export default function AdminDashboard({ currentUserId, currentUserRole }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<"verification" | "users">("verification");
  
  // State for Verification
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [loadingTutors, setLoadingTutors] = useState(true);
  
  // State for User Management
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    if (activeTab === "verification") {
      fetchTutors();
    } else {
      fetchUsers();
    }
  }, [activeTab]);

  const fetchTutors = async () => {
    setLoadingTutors(true);
    try {
      const res = await fetch("/api/admin/tutors");
      if (res.ok) {
        const data = await res.json();
        setTutors(data);
      }
    } catch (err) {
      clientLogger.error("Error fetching tutors:", err);
    } finally {
      setLoadingTutors(false);
    }
  };

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await fetch("/api/admin/users");
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (err) {
      clientLogger.error("Error fetching users:", err);
    } finally {
      setLoadingUsers(false);
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
        setTutors(prev => prev.map(tutor => ({
          ...tutor,
          educations: tutor.educations.map(edu => 
            edu.id === educationId ? { ...edu, isVerified } : edu
          )
        })));
        clientLogger.success(`Education ${isVerified ? "verified" : "unverified"} successfully`);
      }
    } catch (err) {
      clientLogger.error("Error updating verification:", err);
    } finally {
      setProcessingId(null);
    }
  };

  const handleRoleUpdate = async (userId: string, newRole: string) => {
    setProcessingId(userId);
    try {
      const res = await fetch(`/api/admin/users/${userId}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newRole }),
      });

      if (res.ok) {
        setUsers(prev => prev.map(u => 
          u.id === userId ? { ...u, role: newRole as User["role"] } : u
        ));
        clientLogger.success(`User role updated to ${newRole}`);
      } else {
        const txt = await res.text();
        alert(txt);
      }
    } catch (err) {
      clientLogger.error("Error updating role:", err);
    } finally {
      setProcessingId(null);
    }
  };

  const handleDeleteUser = async (userId: string, userEmail: string) => {
    const confirmed = window.confirm(`Are you sure you want to permanently delete user ${userEmail}? This will also delete their profile, conversations, and messages. This action cannot be undone.`);
    if (!confirmed) return;

    setProcessingId(userId);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setUsers(prev => prev.filter(u => u.id !== userId));
        clientLogger.success("User deleted successfully");
      } else {
        const txt = await res.text();
        alert(txt || "Failed to delete user.");
      }
    } catch (err) {
      clientLogger.error("Error deleting user:", err);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Tab Navigation */}
      <div className="flex gap-4 border-b border-gray-200">
        <button 
          onClick={() => setActiveTab("verification")}
          className={`pb-4 px-2 font-bold text-sm transition-colors relative ${
            activeTab === "verification" ? "text-purple-600" : "text-gray-400 hover:text-gray-600"
          }`}
        >
          Verification Requests
          {activeTab === "verification" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600" />}
        </button>
        <button 
          onClick={() => setActiveTab("users")}
          className={`pb-4 px-2 font-bold text-sm transition-colors relative ${
            activeTab === "users" ? "text-purple-600" : "text-gray-400 hover:text-gray-600"
          }`}
        >
          User Management
          {activeTab === "users" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600" />}
        </button>
      </div>

      {activeTab === "verification" ? (
        <section>
          {loadingTutors ? (
            <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div></div>
          ) : tutors.length === 0 ? (
            <div className="card p-12 text-center text-gray-500">No verification requests.</div>
          ) : (
            <div className="grid gap-6">
              {tutors.map((tutor) => (
                <div key={tutor.id} className="card p-0 overflow-hidden border border-gray-200 shadow-sm">
                  <div className="bg-gray-50 p-4 border-b border-gray-200 flex justify-between items-center">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">{tutor.name}</h2>
                      <p className="text-sm text-gray-600">{tutor.user.email} • {tutor.subject}</p>
                    </div>
                  </div>
                  <div className="p-4 bg-white">
                    <div className="space-y-4">
                      {tutor.educations.map((edu) => (
                        <div key={edu.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg bg-gray-50 border border-gray-100 gap-4">
                          <div>
                            <h4 className="font-bold text-gray-900">{edu.degree} in {edu.major}</h4>
                            <p className="text-sm text-gray-600">{edu.university}</p>
                            {edu.documentUrl && (
                              <a href={edu.documentUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-bold text-purple-600 hover:text-purple-800 mt-2">
                                VIEW DOCUMENT
                              </a>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            {edu.isVerified ? (
                              <button onClick={() => handleVerify(edu.id, false)} disabled={processingId === edu.id} className="bg-green-100 text-green-700 text-xs font-bold px-4 py-2 rounded-lg border border-green-200 hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-colors">
                                VERIFIED (Click to Revoke)
                              </button>
                            ) : (
                              <button onClick={() => handleVerify(edu.id, true)} disabled={processingId === edu.id} className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-6 py-2 rounded-lg transition-colors">
                                {processingId === edu.id ? "Processing..." : "Verify Degree"}
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      ) : (
        <section>
          {loadingUsers ? (
            <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div></div>
          ) : (
            <div className="card p-0 overflow-hidden border border-gray-200">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900">{user.name || "Unnamed User"}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-tighter border ${
                          user.role === "ADMIN" ? "bg-purple-50 text-purple-700 border-purple-100" :
                          user.role === "TUTOR" ? "bg-blue-50 text-blue-700 border-blue-100" :
                          "bg-gray-50 text-gray-700 border-gray-100"
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end items-center gap-3">
                          <select 
                            value={user.role} 
                            onChange={(e) => handleRoleUpdate(user.id, e.target.value)}
                            disabled={processingId === user.id}
                            className="text-xs border border-gray-200 rounded px-2 py-1 bg-white dark:bg-gray-800 dark:border-gray-700"
                          >
                            <option value="PARENT">Make Parent</option>
                            <option value="TUTOR">Make Tutor</option>
                            <option value="ADMIN">Make Admin</option>
                            {currentUserRole === "MASTER_ADMIN" && (
                              <option value="MASTER_ADMIN">Make Master Admin</option>
                            )}
                          </select>

                          {currentUserRole === "MASTER_ADMIN" && user.id !== currentUserId && (
                            <button
                              onClick={() => handleDeleteUser(user.id, user.email)}
                              disabled={processingId === user.id}
                              className="text-xs text-red-500 hover:text-red-700 font-bold uppercase tracking-tighter transition-colors disabled:opacity-50"
                            >
                              {processingId === user.id ? "..." : "Delete"}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
