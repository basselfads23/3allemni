// src/app/parent/page.tsx
// BLOCK: Student Browse Page
// Displays all tutors with filtering capabilities

"use client";

import { useEffect, useState } from "react";
import { Tutor } from "@/lib/validations";
import { getUniqueValues } from "@/lib/utils";
import TutorCard from "@/components/tutor/TutorCard";
import TutorFilters from "@/components/tutor/TutorFilters";
import { clientLogger } from "@/lib/logger";

// BLOCK: Main component function
export default function Home() {
  // BLOCK: State management
  const [tutors, setTutors] = useState<Tutor[]>([]);

  // State variable to store the currently selected subject filter
  const [selectedSubject, setSelectedSubject] =
    useState<string>("All Subjects");

  const [selectedLocation, setSelectedLocation] =
    useState<string>("All Locations");

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const response = await fetch("/api/tutors");

        if (response.ok) {
          const data = await response.json();

          setTutors(data);
        } else {
          clientLogger.error("Failed to fetch tutors");
        }
      } catch (error) {
        clientLogger.error("Error fetching tutors:", error);
      }
    };

    // Execute the fetch function immediately
    fetchTutors(); // Call the function we just defined
  }, []);

  const uniqueLocations = getUniqueValues(tutors, "location")
    .filter((location): location is string => location !== null)
    .sort();

  const filteredTutors = tutors.filter((tutor) => {
    const matchesSubject =
      selectedSubject === "All Subjects" || tutor.subject === selectedSubject;

    const matchesLocation =
      selectedLocation === "All Locations" ||
      tutor.location === selectedLocation;

    return matchesSubject && matchesLocation;
  });

  return (
    <main className="page-container">
      <div className="content-wrapper">
        <h1 className="page-title">Tutor Profiles</h1>

        <TutorFilters
          selectedSubject={selectedSubject}
          selectedLocation={selectedLocation}
          uniqueLocations={uniqueLocations}
          onSubjectChange={setSelectedSubject}
          onLocationChange={setSelectedLocation}
        />

        {filteredTutors.length > 0 ? (
          <ul className="tutor-list">
            {filteredTutors.map((tutor: Tutor) => (
              <TutorCard key={tutor.id} tutor={tutor} />
            ))}
          </ul>
        ) : (
          <p className="empty-message">No tutors available.</p>
        )}
      </div>
    </main>
  );
}
