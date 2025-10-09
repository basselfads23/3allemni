// src/app/tutor/page.tsx

"use client";

import { useState } from "react";

export default function Home() {
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, subject }),
    });

    if (res.ok) {
      alert("Form submitted successfully!");
      setName("");
      setSubject("");
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
            <label htmlFor="subject" className="form-label">
              Subject
            </label>

            <input
              type="text"
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="form-input"
              required
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
