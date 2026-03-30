// src/app/parent/page.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { Tutor } from "@/lib/validations";
import TutorCard from "@/components/tutor/TutorCard";
import TutorFilters from "@/components/tutor/TutorFilters";
import { clientLogger } from "@/lib/logger";

export default function Home() {
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string>("All Subjects");
  const [selectedGovernorate, setSelectedGovernorate] = useState<string>("All Governorates");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("All Districts");
  const [selectedTeachingMode, setSelectedTeachingMode] = useState<string>("All Modes");

  const fetchTutors = useCallback(async () => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const response = await fetch("/api/tutors");
      if (response.ok) {
        const data = await response.json();
        setTutors(data);
      } else {
        setFetchError("Failed to load tutors. Please try again.");
      }
    } catch (error) {
      clientLogger.error("Error fetching tutors:", error);
      setFetchError("Something went wrong. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTutors();
  }, [fetchTutors]);

  const filteredTutors = tutors.filter((tutor) => {
    const matchesSubject = selectedSubject === "All Subjects" || tutor.subject === selectedSubject;
    const matchesGov = selectedGovernorate === "All Governorates" || tutor.governorate === selectedGovernorate;
    const matchesDist = selectedDistrict === "All Districts" || tutor.district === selectedDistrict;
    const matchesMode = selectedTeachingMode === "All Modes" || tutor.teachingMode === selectedTeachingMode;

    return matchesSubject && matchesGov && matchesDist && matchesMode;
  });

  return (
    <main className="page-container">
      <div className="content-wrapper">
        <h1 className="page-title">Tutor Profiles</h1>

        <TutorFilters
          selectedSubject={selectedSubject}
          selectedGovernorate={selectedGovernorate}
          selectedDistrict={selectedDistrict}
          selectedTeachingMode={selectedTeachingMode}
          onSubjectChange={setSelectedSubject}
          onGovernorateChange={(gov) => {
            setSelectedGovernorate(gov);
            setSelectedDistrict("All Districts");
          }}
          onDistrictChange={setSelectedDistrict}
          onTeachingModeChange={setSelectedTeachingMode}
        />

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : fetchError ? (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-center">
            <p className="text-red-700 font-medium mb-2">{fetchError}</p>
            <button
              onClick={fetchTutors}
              className="text-sm text-red-600 underline hover:no-underline"
            >
              Try again
            </button>
          </div>
        ) : filteredTutors.length > 0 ? (
          <ul className="tutor-list">
            {filteredTutors.map((tutor: Tutor) => (
              <TutorCard key={tutor.id} tutor={tutor} />
            ))}
          </ul>
        ) : (
          <p className="empty-message">No tutors found matching your filters.</p>
        )}
      </div>
    </main>
  );
}
