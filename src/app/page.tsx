"use client";

import { useEffect, useState } from "react";

interface Tutor {
  name: string;
  subject: string;
}

export default function Home() {
  const [tutors, setTutors] = useState<Tutor[]>([]);

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const response = await fetch("/api/tutors");
        if (response.ok) {
          const data = await response.json();
          setTutors(data);
        } else {
          console.error("Failed to fetch tutors");
        }
      } catch (error) {
        console.error("Error fetching tutors:", error);
      }
    };

    fetchTutors();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Tutor Profiles</h1>
      {tutors.length > 0 ? (
        <ul>
          {tutors.map((tutor, index) => (
            <li key={index} className="text-lg">
              {tutor.name} - {tutor.subject}
            </li>
          ))}
        </ul>
      ) : (
        <p>No tutors available.</p>
      )}
    </main>
  );
}