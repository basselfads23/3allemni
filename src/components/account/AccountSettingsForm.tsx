// src/components/account/AccountSettingsForm.tsx
"use client";

import { useState } from "react";
import { userSettingsSchema } from "@/lib/validations";
import { clientLogger } from "@/lib/logger";

type UserData = {
  id: string;
  name: string | null;
  email: string;
  phoneNumber: string | null;
};

type AccountSettingsFormProps = {
  user: UserData;
};

export default function AccountSettingsForm({ user }: AccountSettingsFormProps) {
  const [name, setName] = useState(user.name || "");
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber || "");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);
    setErrors({});

    const validationData = {
      name,
      phoneNumber,
    };

    const result = userSettingsSchema.safeParse(validationData);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((error) => {
        const field = error.path[0] as string;
        fieldErrors[field] = error.message;
      });
      setErrors(fieldErrors);
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/user/settings", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validationData),
      });

      if (res.ok) {
        setMessage({ type: "success", text: "Settings updated successfully!" });
        clientLogger.success("User settings updated successfully");
      } else {
        const errorText = await res.text();
        setMessage({ type: "error", text: `Update failed: ${errorText}` });
        clientLogger.error("Failed to update user settings:", errorText);
      }
    } catch (err) {
      setMessage({ type: "error", text: "An error occurred while updating settings." });
      clientLogger.error("Error updating user settings:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card form">
      <div className="form-field">
        <label htmlFor="email" className="form-label">Email Address (Read-only)</label>
        <input 
          type="email" 
          id="email" 
          value={user.email} 
          className="form-input bg-gray-100 cursor-not-allowed opacity-75" 
          disabled 
          readOnly 
        />
        <p className="text-xs text-gray-500 mt-1">Email cannot be changed as it is linked to your Google account.</p>
      </div>

      <div className="form-field">
        <label htmlFor="name" className="form-label">Full Name</label>
        <input 
          type="text" 
          id="name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          className={`form-input ${errors.name ? "border-red-500" : ""}`} 
          placeholder="e.g. John Doe"
          required 
        />
        {errors.name && <p className="form-error">{errors.name}</p>}
      </div>

      <div className="form-field">
        <label htmlFor="phoneNumber" className="form-label">Phone Number</label>
        <input 
          type="tel" 
          id="phoneNumber" 
          value={phoneNumber} 
          onChange={(e) => setPhoneNumber(e.target.value)} 
          className={`form-input ${errors.phoneNumber ? "border-red-500" : ""}`} 
          placeholder="e.g. 70123456"
        />
        {errors.phoneNumber && <p className="form-error">{errors.phoneNumber}</p>}
        <p className="text-xs text-gray-500 mt-1">This is your general contact number used for account communication.</p>
      </div>

      {message && (
        <div className={`p-4 rounded-md mb-6 ${message.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
          {message.text}
        </div>
      )}

      <button 
        type="submit" 
        className="form-button w-full flex justify-center items-center" 
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Saving Changes...
          </>
        ) : "Save Settings"}
      </button>
    </form>
  );
}
