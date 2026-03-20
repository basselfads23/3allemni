// src/components/tutor/TutorForm.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { tutorSchema, Tutor } from "@/lib/validations";
import { clientLogger } from "@/lib/logger";
import { SUBJECTS } from "@/lib/constants";
import { LEBANON_LOCATIONS, Governorate } from "@/lib/lebanon-locations";

type TutorFormProps = {
  initialData?: Tutor | null;
};

export default function TutorForm({ initialData }: TutorFormProps) {
  const router = useRouter();
  const [name, setName] = useState(initialData?.name || "");
  const [subject, setSubject] = useState(initialData?.subject || "");
  const [bio, setBio] = useState(initialData?.bio || "");
  const [hourlyRate, setHourlyRate] = useState(initialData?.hourlyRate ? initialData.hourlyRate.toString() : "");
  const [teachingMode, setTeachingMode] = useState<"IN_PERSON" | "ONLINE" | "BOTH">(
    (initialData?.teachingMode as "IN_PERSON" | "ONLINE" | "BOTH") || "IN_PERSON"
  );
  const [governorate, setGovernorate] = useState<string>(initialData?.governorate || "");
  const [district, setDistrict] = useState(initialData?.district || "");
  const [city, setCity] = useState(initialData?.city || "");
  const [phoneNumber, setPhoneNumber] = useState(initialData?.phoneNumber || "");
  const [profilePicture, setProfilePicture] = useState<File | null>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Reset district when governorate changes
  useEffect(() => {
    if (governorate && initialData?.governorate !== governorate) {
      setDistrict("");
    }
  }, [governorate, initialData?.governorate]);

  const handleDelete = async () => {
    if (!initialData?.id) return;
    
    const confirmed = window.confirm(
      "Are you sure you want to delete your tutor profile? This action cannot be undone."
    );
    
    if (!confirmed) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/tutor/${initialData.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        alert("Profile deleted successfully.");
        router.push("/tutor/dashboard");
        router.refresh();
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
    setErrors({});

    const validationData = {
      name,
      subject,
      bio,
      hourlyRate: hourlyRate === "" ? undefined : parseFloat(hourlyRate),
      teachingMode,
      governorate,
      district,
      city,
      phoneNumber,
    };

    const result = tutorSchema.safeParse(validationData);

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

    const formData = new FormData();
    Object.entries(validationData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });

    if (profilePicture) {
      formData.append("profilePicture", profilePicture);
    }

    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        alert("Profile saved successfully!");
        router.push("/tutor/dashboard");
        router.refresh();
      } else {
        const errorText = await res.text();
        alert(`Submission failed: ${errorText}`);
      }
    } catch (err) {
      clientLogger.error("Submit error:", err);
      alert("An error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card form">
      <div className="form-field">
        <label htmlFor="name" className="form-label">Display Name</label>
        <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="form-input" required />
        {errors.name && <p className="form-error">{errors.name}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="form-field">
          <label htmlFor="subject" className="form-label">Subject</label>
          <select id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} className="form-input" required>
            <option value="" hidden disabled>Select a subject</option>
            {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          {errors.subject && <p className="form-error">{errors.subject}</p>}
        </div>

        <div className="form-field">
          <label htmlFor="hourlyRate" className="form-label">Hourly Rate ($)</label>
          <input type="number" id="hourlyRate" value={hourlyRate} onChange={(e) => setHourlyRate(e.target.value)} className="form-input" placeholder="e.g. 20" required />
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
        <label htmlFor="phoneNumber" className="form-label">Business Phone (Optional)</label>
        <input type="tel" id="phoneNumber" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="form-input" placeholder="e.g. 70123456" />
      </div>

      <div className="form-field">
        <label htmlFor="bio" className="form-label">Bio (Experience & Style)</label>
        <textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} className="form-input min-h-[120px]" placeholder="Tell parents about your teaching methods..." />
      </div>

      <div className="form-field">
        <label htmlFor="profilePicture" className="form-label">Profile Picture</label>
        <input type="file" id="profilePicture" accept="image/*" className="form-input" onChange={(e) => setProfilePicture(e.target.files?.[0] || null)} />
      </div>

      <div className="button-group flex gap-3 mt-6">
        <button type="submit" disabled={isLoading} className="form-button flex-1">
          {isLoading ? "Saving..." : (initialData ? "Update Profile" : "Create Profile")}
        </button>
        
        {initialData && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded transition-colors disabled:opacity-50"
          >
            {isDeleting ? "Deleting..." : "Delete Profile"}
          </button>
        )}
      </div>
    </form>
  );
}
