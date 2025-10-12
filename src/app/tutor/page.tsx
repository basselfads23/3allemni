// src/app/tutor/page.tsx

"use client";

// BLOCK: Imports
// Import React hook for managing component state
import { useState } from "react";

// Import Zod schema for validation
import { tutorSchema } from "@/lib/validations"; // Import our validation rules from validations.ts

export default function Home() {
  // BLOCK: State variables for form fields
  // Each state holds the value of one form input field
  const [name, setName] = useState(""); // Holds the name input value
  const [email, setEmail] = useState(""); // Holds the email input value
  const [subject, setSubject] = useState(""); // Holds the subject dropdown value
  const [bio, setBio] = useState(""); // Holds the bio textarea value
  const [profilePicture, setProfilePicture] = useState<File | null>(null); // Holds the profile picture file (optional)

  // BLOCK: State for validation errors
  // This will store error messages from Zod validation
  const [errors, setErrors] = useState<Record<string, string>>({}); // Record<string, string> means an object with string keys and string values, like { email: "Invalid email", name: "Too short" }

  // BLOCK: State for file input reference
  // Store reference to file input element so we can reset it programmatically
  const [fileInputKey, setFileInputKey] = useState(0); // Key to force file input to re-render and clear

  // BLOCK: Form submission handler
  // This function runs when the user clicks the Submit button
  const handleSubmit = async (e: React.FormEvent) => {
    // e: React.FormEvent is the event object from the form submission
    e.preventDefault(); // Prevents the browser from refreshing the page (default form behavior)

    // BLOCK: Clear previous errors
    // Reset errors to empty object before validating
    setErrors({}); // Clears any old error messages from previous submission attempts

    // BLOCK: Prepare form data for validation
    // Collect all form field values into one object
    const validationData = {
      name, // Current value of name field
      email, // Current value of email field
      subject, // Current value of subject field
      bio, // Current value of bio field (can be empty since it's optional)
    };

    // BLOCK: Validate form data with Zod
    // Use safeParse to check if data matches our schema rules
    const result = tutorSchema.safeParse(validationData);
    // safeParse returns an object with either:
    // - { success: true, data: validatedData } if validation passes
    // - { success: false, error: zodError } if validation fails

    // BLOCK: Handle validation failure
    // If validation fails, show error messages and stop submission
    if (!result.success) {
      // !result.success means validation failed
      // Extract error messages from Zod error object
      const fieldErrors: Record<string, string> = {}; // Create empty object to store field-specific errors

      // Loop through all validation errors
      result.error.issues.forEach((error) => {
        // result.error.errors is an array of all validation failures
        // error.path is an array showing which field failed (e.g., ["email"])
        // error.message is the error message we defined in the schema
        const field = error.path[0] as string; // Get the field name (first element of path array)
        fieldErrors[field] = error.message; // Store error message for this field
      });

      setErrors(fieldErrors); // Update state to display error messages in the UI
      return; // Stop here - don't submit to the API if validation failed
    }

    // BLOCK: Submit validated data to API
    // If we reach here, validation passed! Now submit to backend
    // Use FormData to send both text fields and file upload
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("subject", subject);
    formData.append("bio", bio);

    // Add profile picture file if one was selected
    if (profilePicture) {
      formData.append("profilePicture", profilePicture);
    }

    const res = await fetch("/api/submit", {
      method: "POST", // HTTP method for creating/sending data
      // Don't set Content-Type header - browser will set it automatically with boundary for multipart/form-data
      body: formData, // Send FormData instead of JSON
    });

    // BLOCK: Handle API response
    // Check if submission was successful
    if (res.ok) {
      // res.ok is true if status code is 200-299
      alert("Form submitted successfully!"); // Show success message
      // Clear all form fields after successful submission
      setName("");
      setEmail("");
      setSubject("");
      setBio("");
      setProfilePicture(null);
      setFileInputKey((prev) => prev + 1); // Reset file input by changing its key
    } else {
      // If API returned error (400, 500, etc.)
      alert("Form submission failed."); // Show error message
    }
  };

  return (
    <main className="page-container">
      <div className="content-wrapper-narrow">
        <h1 className="page-title-sm">Tutor Registration</h1>

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

            {/* Display error message if name validation fails */}
            {errors.name && <p className="form-error">{errors.name}</p>}
            {/* errors.name checks if there's an error for the name field */}
            {/* && means "and if true, render the <p> tag" */}
            {/* {errors.name} displays the actual error message */}
          </div>

          <div className="form-field">
            <label htmlFor="email" className="form-label">
              Email
            </label>

            <input
              type="text"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              required
            />

            {/* Display error message if email validation fails */}
            {errors.email && <p className="form-error">{errors.email}</p>}
            {/* This will show "Please enter a valid email address" if email format is wrong */}
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
              required>
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

            {/* Display error message if subject validation fails */}
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
                // Get the first file from the file input (if any)
                const file = e.target.files?.[0] || null;
                setProfilePicture(file);
              }}
            />

            {/* Display selected file name if a file is chosen */}
            {profilePicture && (
              <p style={{ marginTop: "0.5rem", fontSize: "0.875rem", color: "#4b5563" }}>
                Selected: {profilePicture.name}
              </p>
            )}
          </div>

          <button type="submit" className="form-button">
            Submit
          </button>
        </form>
      </div>
    </main>
  );
}
