// src/components/account/AccountSettingsForm.tsx
"use client";

import { useState, useEffect } from "react";
import { userSettingsSchema, tutorSchema, Tutor } from "@/lib/validations";
import { clientLogger } from "@/lib/logger";
import { SUBJECTS } from "@/lib/constants";
import { LEBANON_LOCATIONS, Governorate } from "@/lib/lebanon-locations";

type UserRole = "PARENT" | "TUTOR" | "ADMIN";

type UserData = {
  id: string;
  name: string | null;
  email: string;
  phoneNumber: string | null;
  role: UserRole;
  tutor?: Tutor | null;
};

type AccountSettingsFormProps = {
  user: UserData;
};

interface SubmissionData {
  name: string;
  phoneNumber: string;
  role: UserRole;
  subject?: string;
  hourlyRate?: number;
  teachingMode?: "IN_PERSON" | "ONLINE" | "BOTH";
  governorate?: string;
  district?: string;
  city?: string;
  bio?: string;
}

export default function AccountSettingsForm({ user }: AccountSettingsFormProps) {
  // Personal Info State
  const [name, setName] = useState(user.name || "");
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber || "");
  const [role, setRole] = useState<UserRole>(user.role || "TUTOR");

  // Tutor Profile State
  const [subject, setSubject] = useState(user.tutor?.subject || "");
  const [hourlyRate, setHourlyRate] = useState(user.tutor?.hourlyRate ? user.tutor.hourlyRate.toString() : "");
  const [teachingMode, setTeachingMode] = useState<"IN_PERSON" | "ONLINE" | "BOTH">(
    (user.tutor?.teachingMode as "IN_PERSON" | "ONLINE" | "BOTH") || "IN_PERSON"
  );
  const [governorate, setGovernorate] = useState<string>(user.tutor?.governorate || "");
  const [district, setDistrict] = useState(user.tutor?.district || "");
  const [city, setCity] = useState(user.tutor?.city || "");
  const [bio, setBio] = useState(user.tutor?.bio || "");

  // UI State
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset district when governorate changes
  useEffect(() => {
    if (governorate && user.tutor?.governorate !== governorate) {
      setDistrict("");
    }
  }, [governorate, user.tutor?.governorate]);

  const handleDeleteProfile = async () => {
    if (!user.tutor?.id) return;
    
    const confirmed = window.confirm(
      "Are you sure you want to delete your tutor profile? This will not delete your account, but you will no longer be listed as a tutor."
    );
    
    if (!confirmed) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/tutor/${user.tutor.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        alert("Tutor profile deleted successfully.");
        window.location.reload();
      } else {
        const errorText = await res.text();
        alert(`Deletion failed: ${errorText}`);
      }
    } catch (err) {
      clientLogger.error("Deletion error:", err);
      alert("An error occurred while deleting your profile.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);
    setErrors({});

    const submissionData: SubmissionData = {
      name,
      phoneNumber,
      role,
    };

    // If role is TUTOR, add tutor fields
    if (role === "TUTOR") {
      submissionData.subject = subject;
      submissionData.hourlyRate = hourlyRate === "" ? undefined : parseFloat(hourlyRate);
      submissionData.teachingMode = teachingMode;
      submissionData.governorate = governorate;
      submissionData.district = district;
      submissionData.city = city;
      submissionData.bio = bio;
    }

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

    if (role === "TUTOR") {
      const tutorResult = tutorSchema.safeParse(submissionData);
      if (!tutorResult.success) {
        const fieldErrors: Record<string, string> = {};
        tutorResult.error.issues.forEach((error) => {
          fieldErrors[error.path[0] as string] = error.message;
        });
        setErrors((prev) => ({ ...prev, ...fieldErrors }));
        setIsLoading(false);
        return;
      }
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
      <form onSubmit={handleSubmit} className="card form">
        {/* SECTION 1: Personal Information */}
        <section className="space-y-4">
          <h3 className="text-lg font-bold border-b pb-2">Personal Information</h3>
          
          <div className="form-field">
            <label className="form-label">Email Address (Read-only)</label>
            <input type="email" value={user.email} className="form-input bg-gray-50 opacity-70" disabled readOnly />
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
            </select>
          </div>
        </section>

        {/* SECTION 2: Tutor Profile (Conditional) */}
        {role === "TUTOR" && (
          <section className="mt-8 pt-8 border-t border-gray-200 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold">Tutor Profile Details</h3>
              {user.tutor && (
                <button 
                  type="button" 
                  onClick={handleDeleteProfile} 
                  disabled={isDeleting}
                  className="text-xs text-red-600 font-semibold hover:underline"
                >
                  {isDeleting ? "Deleting..." : "Delete Tutor Profile"}
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-field">
                <label htmlFor="subject" className="form-label">Subject</label>
                <select id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} className="form-input" required>
                  <option value="" disabled>Select a subject</option>
                  {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                {errors.subject && <p className="form-error">{errors.subject}</p>}
              </div>

              <div className="form-field">
                <label htmlFor="hourlyRate" className="form-label">Hourly Rate ($)</label>
                <input type="number" id="hourlyRate" value={hourlyRate} onChange={(e) => setHourlyRate(e.target.value)} className="form-input" required />
                {errors.hourlyRate && <p className="form-error">{errors.hourlyRate}</p>}
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="teachingMode" className="form-label">Teaching Mode</label>
              <select 
                id="teachingMode" 
                value={teachingMode} 
                onChange={(e) => setTeachingMode(e.target.value as "IN_PERSON" | "ONLINE" | "BOTH")} 
                className="form-input" 
                required
              >
                <option value="IN_PERSON">In Person</option>
                <option value="ONLINE">Online</option>
                <option value="BOTH">Both</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="form-field">
                <label htmlFor="governorate" className="form-label">Governorate</label>
                <select id="governorate" value={governorate} onChange={(e) => setGovernorate(e.target.value)} className="form-input" required>
                  <option value="" disabled>Select</option>
                  {Object.keys(LEBANON_LOCATIONS).map((gov) => <option key={gov} value={gov}>{gov}</option>)}
                </select>
              </div>

              <div className="form-field">
                <label htmlFor="district" className="form-label">District</label>
                <select id="district" value={district} onChange={(e) => setDistrict(e.target.value)} className="form-input" required disabled={!governorate}>
                  <option value="" disabled>Select</option>
                  {governorate && LEBANON_LOCATIONS[governorate as Governorate].map((dist) => (
                    <option key={dist} value={dist}>{dist}</option>
                  ))}
                </select>
              </div>

              <div className="form-field">
                <label htmlFor="city" className="form-label">City/Village</label>
                <input type="text" id="city" value={city} onChange={(e) => setCity(e.target.value)} className="form-input" required />
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="bio" className="form-label">Bio (Experience & Style)</label>
              <textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} className="form-input min-h-[100px]" />
            </div>
          </section>
        )}

        <div className="mt-8 pt-6 border-t border-gray-100">
          {message && (
            <div className={`p-4 rounded-md mb-4 ${message.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
              {message.text}
            </div>
          )}

          <button type="submit" disabled={isLoading} className="form-button w-full flex justify-center py-3">
            {isLoading ? "Saving..." : "Save All Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
