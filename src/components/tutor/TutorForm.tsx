// src/components/tutor/TutorForm.tsx
// Reusable form component for creating and editing tutor profiles

"use client";

import { useState, useEffect } from "react";
import { tutorSchema } from "@/lib/validations";

interface TutorFormProps {
  mode: "create" | "edit";
  initialData?: {
    name: string;
    subject: string;
    bio?: string;
    price?: number;
    location?: string;
    profilePictureUrl?: string;
  };
  onSuccess?: () => void;
}

export default function TutorForm({ mode, initialData, onSuccess }: TutorFormProps) {
  // Form state
  const [name, setName] = useState(initialData?.name || "");
  const [subject, setSubject] = useState(initialData?.subject || "");
  const [bio, setBio] = useState(initialData?.bio || "");
  const [price, setPrice] = useState(initialData?.price?.toString() || "");
  const [location, setLocation] = useState(initialData?.location || "");
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [fileInputKey, setFileInputKey] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update form when initialData changes
  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setSubject(initialData.subject || "");
      setBio(initialData.bio || "");
      setPrice(initialData.price?.toString() || "");
      setLocation(initialData.location || "");
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    // Validate form data
    const validationData = {
      name,
      subject,
      bio,
      price: price === "" ? undefined : parseFloat(price),
      location: location === "" ? undefined : location,
    };

    const result = tutorSchema.safeParse(validationData);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((error) => {
        const field = error.path[0] as string;
        fieldErrors[field] = error.message;
      });
      setErrors(fieldErrors);
      setIsSubmitting(false);
      return;
    }

    // Prepare form data
    const formData = new FormData();
    formData.append("name", name);
    formData.append("subject", subject);
    formData.append("bio", bio);

    if (price !== "") {
      formData.append("price", price);
    }

    if (location !== "") {
      formData.append("location", location);
    }

    if (profilePicture) {
      formData.append("profilePicture", profilePicture);
    }

    try {
      const endpoint = mode === "create" ? "/api/submit" : "/api/tutor/update";
      const res = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        alert(`Profile ${mode === "create" ? "created" : "updated"} successfully!`);

        if (mode === "create") {
          // Clear form after creation
          setName("");
          setSubject("");
          setBio("");
          setPrice("");
          setLocation("");
          setProfilePicture(null);
          setFileInputKey((prev) => prev + 1);
        }

        if (onSuccess) {
          onSuccess();
        }
      } else {
        const errorData = await res.json();
        alert(errorData.error || "Form submission failed.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card form">
      <div className="form-field">
        <label htmlFor="name" className="form-label">
          Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="form-input"
          required
        />
        {errors.name && <p className="form-error">{errors.name}</p>}
      </div>

      <div className="form-field">
        <label htmlFor="subject" className="form-label">
          Subject
        </label>
        <select
          id="subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="form-input"
          required
        >
          <option value="" hidden disabled>
            Select a subject
          </option>
          <option value="Physics">Physics</option>
          <option value="Chemistry">Chemistry</option>
          <option value="Biology">Biology</option>
          <option value="Maths">Maths</option>
          <option value="English">English</option>
          <option value="French">French</option>
          <option value="Arabic">Arabic</option>
          <option value="Social Sciences">Social Sciences</option>
        </select>
        {errors.subject && <p className="form-error">{errors.subject}</p>}
      </div>

      <div className="form-field">
        <label htmlFor="bio" className="form-label">
          Bio
        </label>
        <textarea
          id="bio"
          value={bio}
          className="form-input"
          placeholder="Describe yourself briefly"
          onChange={(e) => setBio(e.target.value)}
        />
      </div>

      <div className="form-field">
        <label htmlFor="price" className="form-label">
          Price per Hour (Optional)
        </label>
        <input
          type="number"
          id="price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="form-input"
          placeholder="e.g. 25.00"
          step="0.01"
          min="0"
        />
        {errors.price && <p className="form-error">{errors.price}</p>}
      </div>

      <div className="form-field">
        <label htmlFor="location" className="form-label">
          Location (Optional)
        </label>
        <input
          type="text"
          id="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="form-input"
          placeholder="e.g. Beirut, Lebanon"
        />
        {errors.location && <p className="form-error">{errors.location}</p>}
      </div>

      <div className="form-field">
        <label htmlFor="profilePicture" className="form-label">
          Profile Picture (Optional)
        </label>
        <input
          key={fileInputKey}
          type="file"
          id="profilePicture"
          accept="image/*"
          className="form-input"
          onChange={(e) => {
            const file = e.target.files?.[0] || null;
            setProfilePicture(file);
          }}
        />
        {profilePicture && (
          <p style={{ marginTop: "0.5rem", fontSize: "0.875rem", color: "#4b5563" }}>
            Selected: {profilePicture.name}
          </p>
        )}
        {mode === "edit" && initialData?.profilePictureUrl && !profilePicture && (
          <p style={{ marginTop: "0.5rem", fontSize: "0.875rem", color: "#4b5563" }}>
            Current profile picture will be kept if no new file is selected
          </p>
        )}
      </div>

      <button type="submit" className="form-button" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : mode === "create" ? "Create Profile" : "Update Profile"}
      </button>
    </form>
  );
}
