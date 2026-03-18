// src/components/tutor/TutorForm.tsx
"use client";

import { useState, useEffect } from "react";
import { tutorSchema, Tutor } from "@/lib/validations";
import { SUBJECTS } from "@/lib/constants";
import { LEBANON_LOCATIONS, Governorate } from "@/lib/lebanon-locations";

type TutorFormProps = {
  initialData?: Tutor | null;
};

export default function TutorForm({ initialData }: TutorFormProps) {
  const [name, setName] = useState(initialData?.name || "");
  const [subject, setSubject] = useState(initialData?.subject || "");
  const [bio, setBio] = useState(initialData?.bio || "");
  const [hourlyRate, setHourlyRate] = useState(initialData?.hourlyRate ? initialData.hourlyRate.toString() : "");
  const [teachingMode, setTeachingMode] = useState(initialData?.teachingMode || "IN_PERSON");
  const [governorate, setGovernorate] = useState<string>(initialData?.governorate || "");
  const [district, setDistrict] = useState(initialData?.district || "");
  const [city, setCity] = useState(initialData?.city || "");
  const [email, setEmail] = useState(initialData?.email || "");
  const [phoneNumber, setPhoneNumber] = useState(initialData?.phoneNumber || "");
  const [profilePicture, setProfilePicture] = useState<File | null>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});
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
        window.location.href = "/tutor/dashboard";
      } else {
        const errorText = await res.text();
        alert(`Deletion failed: ${errorText}`);
      }
    } catch (err) {
      alert("An error occurred while deleting your profile.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      email,
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

    const res = await fetch("/api/submit", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      alert("Profile saved successfully!");
      window.location.href = "/tutor/dashboard";
    } else {
      const errorText = await res.text();
      alert(`Submission failed: ${errorText}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card form">
      <div className="form-field">
        <label htmlFor="name" className="form-label">Name</label>
        <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="form-input" required />
        {errors.name && <p className="form-error">{errors.name}</p>}
      </div>

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

      <div className="form-field">
        <label htmlFor="teachingMode" className="form-label">Teaching Mode</label>
        <select id="teachingMode" value={teachingMode} onChange={(e) => setTeachingMode(e.target.value as "IN_PERSON" | "ONLINE" | "BOTH")} className="form-input" required>
          <option value="IN_PERSON">In Person</option>
          <option value="ONLINE">Online</option>
          <option value="BOTH">Both</option>
        </select>
        {errors.teachingMode && <p className="form-error">{errors.teachingMode}</p>}
      </div>

      <div className="form-field">
        <label htmlFor="governorate" className="form-label">Governorate</label>
        <select id="governorate" value={governorate} onChange={(e) => setGovernorate(e.target.value)} className="form-input" required>
          <option value="" disabled>Select Governorate</option>
          {Object.keys(LEBANON_LOCATIONS).map((gov) => <option key={gov} value={gov}>{gov}</option>)}
        </select>
        {errors.governorate && <p className="form-error">{errors.governorate}</p>}
      </div>

      <div className="form-field">
        <label htmlFor="district" className="form-label">District</label>
        <select id="district" value={district} onChange={(e) => setDistrict(e.target.value)} className="form-input" required disabled={!governorate}>
          <option value="" disabled>Select District</option>
          {governorate && LEBANON_LOCATIONS[governorate as Governorate].map((dist) => (
            <option key={dist} value={dist}>{dist}</option>
          ))}
        </select>
        {errors.district && <p className="form-error">{errors.district}</p>}
      </div>

      <div className="form-field">
        <label htmlFor="city" className="form-label">City/Village</label>
        <input type="text" id="city" value={city} onChange={(e) => setCity(e.target.value)} className="form-input" placeholder="e.g. Hamra" required />
        {errors.city && <p className="form-error">{errors.city}</p>}
      </div>

      <div className="form-field">
        <label htmlFor="phoneNumber" className="form-label">Phone Number</label>
        <input type="tel" id="phoneNumber" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="form-input" placeholder="e.g. 70123456" />
        {errors.phoneNumber && <p className="form-error">{errors.phoneNumber}</p>}
      </div>

      <div className="form-field">
        <label htmlFor="email" className="form-label">Contact Email (Optional)</label>
        <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-input" placeholder="e.g. contact@example.com" />
        {errors.email && <p className="form-error">{errors.email}</p>}
      </div>

      <div className="form-field">
        <label htmlFor="bio" className="form-label">Bio</label>
        <textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} className="form-input" placeholder="Tell us about your experience..." />
      </div>

      <div className="form-field">
        <label htmlFor="profilePicture" className="form-label">Profile Picture</label>
        <input type="file" id="profilePicture" accept="image/*" className="form-input" onChange={(e) => setProfilePicture(e.target.files?.[0] || null)} />
      </div>

      <div className="button-group flex gap-3 mt-6">
        <button type="submit" className="form-button flex-1">
          {initialData ? "Update Profile" : "Create Profile"}
        </button>
        
        {initialData && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="form-button-secondary bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors disabled:opacity-50"
          >
            {isDeleting ? "Deleting..." : "Delete Profile"}
          </button>
        )}
      </div>
    </form>
  );
}
