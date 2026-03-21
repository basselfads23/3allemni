// src/components/account/AccountSettingsForm.tsx
"use client";

import { useState } from "react";
import { userSettingsSchema } from "@/lib/validations";
import { clientLogger } from "@/lib/logger";

type UserRole = "PARENT" | "TUTOR" | "ADMIN";

type UserData = {
  id: string;
  name: string | null;
  email: string;
  phoneNumber: string | null;
  role: UserRole;
};

type AccountSettingsFormProps = {
  user: UserData;
};

export default function AccountSettingsForm({ user }: AccountSettingsFormProps) {
  // Personal Info State
  const [name, setName] = useState(user.name || "");
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber || "");
  const [role, setRole] = useState<UserRole>(user.role || "TUTOR");

  // UI State
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);
    setErrors({});

    const submissionData = {
      name,
      phoneNumber,
      role,
    };

    // Validate
    const userResult = userSettingsSchema.safeParse(submissionData);
    if (!userResult.success) {
      const fieldErrors: Record<string, string> = {};
      userResult.error.issues.forEach((error) => {
        fieldErrors[error.path[0] as string] = error.message;
      });
      setErrors(fieldErrors);
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/user/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData),
      });

      if (res.ok) {
        setMessage({ type: "success", text: "Settings updated successfully!" });
        clientLogger.success("Account settings updated");
        
        // If role changed, nudge user
        if (role !== user.role) {
          alert("Account type changed. Please Sign Out and Sign In again for all features to update.");
        }
      } else {
        const errorData = await res.json();
        setMessage({ type: "error", text: errorData.error || "Update failed" });
      }
    } catch (err) {
      clientLogger.error("Submit error:", err);
      setMessage({ type: "error", text: "An error occurred." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="card form shadow-sm">
        <section className="space-y-4">
          <h3 className="text-lg font-bold border-b pb-2">Personal Information</h3>
          
          <div className="form-field">
            <label className="form-label">Email Address (Read-only)</label>
            <input type="email" value={user.email} className="form-input bg-gray-50 opacity-70 cursor-not-allowed" disabled readOnly />
            <p className="text-xs text-gray-500 mt-1 italic">Email is linked to your Google Account.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-field">
              <label htmlFor="name" className="form-label">Full Name</label>
              <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="form-input" required />
              {errors.name && <p className="form-error">{errors.name}</p>}
            </div>

            <div className="form-field">
              <label htmlFor="phoneNumber" className="form-label">Phone Number</label>
              <input type="tel" id="phoneNumber" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="form-input" placeholder="70123456" />
              {errors.phoneNumber && <p className="form-error">{errors.phoneNumber}</p>}
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="role" className="form-label">Account Type</label>
            <select 
              id="role" 
              value={role} 
              onChange={(e) => setRole(e.target.value as UserRole)} 
              className="form-input" 
              required
            >
              <option value="PARENT">Parent (Looking for Tutors)</option>
              <option value="TUTOR">Tutor (Offering Lessons)</option>
              <option value="ADMIN">Admin (System Owner)</option>
            </select>
            
            {role !== user.role && (
              <div className="mt-3 p-3 bg-amber-50 border border-yellow-200 rounded-md text-sm text-amber-800 flex gap-2 items-start animate-in fade-in slide-in-from-top-1">
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p>
                  <strong>Important:</strong> You must <strong>Sign Out and Sign In again</strong> after saving for your new role features to activate correctly.
                </p>
              </div>
            )}
          </div>
        </section>

        <div className="mt-8 pt-6 border-t border-gray-100">
          {message && (
            <div className={`p-4 rounded-md mb-4 ${message.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
              {message.text}
            </div>
          )}

          <button type="submit" disabled={isLoading} className="form-button w-full flex justify-center py-3">
            {isLoading ? "Saving..." : "Save Account Settings"}
          </button>
        </div>
      </form>
    </div>
  );
}
