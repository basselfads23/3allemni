// src/app/tutor/page.tsx

"use client";

import { useState } from "react";

export default function Home() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [bio, setBio] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, subject, bio }),
    });

    if (res.ok) {
      alert("Form submitted successfully!");
      setName("");
      setEmail("");
      setSubject("");
      setBio("");
    } else {
      alert("Form submission failed.");
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

          <button type="submit" className="form-button">
            Submit
          </button>
        </form>
      </div>
    </main>
  );
}
