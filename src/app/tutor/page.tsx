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
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">The Tutor Marketplace</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 bg-gray-100 p-8 rounded-lg shadow-md"
      >
        <div className="flex flex-col">
          <label htmlFor="name" className="mb-2 font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="subject" className="mb-2 font-medium text-gray-700">
            Subject
          </label>
          <input
            type="text"
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <button
          type="submit"
          className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Submit
        </button>
      </form>
    </main>
  );
}