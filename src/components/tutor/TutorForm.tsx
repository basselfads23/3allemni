// src/components/tutor/TutorForm.tsx
// BLOCK: Tutor Registration Form Component
// Handles tutor registration with validation and file upload

"use client";

import { useState } from "react";
import { tutorSchema, Tutor } from "@/lib/validations";
import { SUBJECTS } from "@/lib/constants";

type TutorFormProps = {
  initialData?: Tutor | null;
};

// BLOCK: TutorForm component
// Form for registering new tutors with validation
export default function TutorForm({ initialData }: TutorFormProps) {
  // BLOCK: State variables for form fields
  const [name, setName] = useState(initialData?.name || "");
  const [subject, setSubject] = useState(initialData?.subject || "");
  const [bio, setBio] = useState(initialData?.bio || "");
  const [price, setPrice] = useState(initialData?.price ? initialData.price.toString() : "");
  const [location, setLocation] = useState(initialData?.location || "");
  const [profilePicture, setProfilePicture] = useState<File | null>(null);

  // BLOCK: State for validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // BLOCK: State for file input reference
  const [fileInputKey, setFileInputKey] = useState(0);

  // BLOCK: Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous errors
    setErrors({});

    // Prepare form data for validation
    const validationData = {
      name,
      subject,
      bio,
      price: price === "" ? undefined : parseFloat(price),
      location: location === "" ? undefined : location,
    };

    // Validate form data with Zod
    const result = tutorSchema.safeParse(validationData);

    // Handle validation failure
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};

      result.error.issues.forEach((error) => {
        const field = error.path[0] as string;
        fieldErrors[field] = error.message;
      });

      setErrors(fieldErrors);
      return;
    }

    // Submit validated data to API
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

    const res = await fetch("/api/submit", {
      method: "POST", // We'll handle both create and update in POST
      body: formData,
    });

    // Handle API response
    if (res.ok) {
      alert("Profile saved successfully!");
      if (!initialData) {
        // Clear all form fields if it was a new creation
        setName("");
        setSubject("");
        setBio("");
        setPrice("");
        setLocation("");
      }
      setProfilePicture(null);
      setFileInputKey((prev) => prev + 1);
    } else {
      alert("Submission failed.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card form">
      {/* BLOCK: Name field */}
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

      {/* BLOCK: Subject field */}
      <div className="form-field">
        <label htmlFor="subject" className="form-label">
          Subject
        </label>

        <select
          id="subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="form-input"
          required>
          <option value="" hidden disabled>
            Select a subject
          </option>

          {/* Dynamically generate subject options from constants */}
          {SUBJECTS.map((subjectItem) => (
            <option key={subjectItem} value={subjectItem}>
              {subjectItem}
            </option>
          ))}
        </select>

        {errors.subject && <p className="form-error">{errors.subject}</p>}
      </div>

      {/* BLOCK: Bio field */}
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

      {/* BLOCK: Price field */}
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

      {/* BLOCK: Location field */}
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

      {/* BLOCK: Profile picture field */}
      <div className="form-field">
        <label htmlFor="profilePicture" className="form-label">
          Profile Picture (Optional)
        </label>
        
        {initialData?.profilePictureUrl && (
          <p className="file-feedback">You already have a profile picture. Uploading a new one will replace it.</p>
        )}

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

        {/* Display selected file name */}
        {profilePicture && (
          <p className="file-feedback">Selected: {profilePicture.name}</p>
        )}
      </div>

      {/* BLOCK: Submit button */}
      <button type="submit" className="form-button">
        {initialData ? "Update Profile" : "Create Profile"}
      </button>
    </form>
  );
}
