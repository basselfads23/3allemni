// src/app/parent/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Tutor } from "@/lib/validations";
import TutorCard from "@/components/tutor/TutorCard";
import TutorFilters from "@/components/tutor/TutorFilters";
import { clientLogger } from "@/lib/logger";

export default function Home() {
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>("All Subjects");
  const [selectedGovernorate, setSelectedGovernorate] = useState<string>("All Governorates");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("All Districts");
  const [selectedTeachingMode, setSelectedTeachingMode] = useState<string>("All Modes");

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
    fetchTutors();
  }, []);

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

        {filteredTutors.length > 0 ? (
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
