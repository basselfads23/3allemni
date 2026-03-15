// src/components/tutor/TutorFilters.tsx
"use client";

import { SUBJECTS } from "@/lib/constants";
import { LEBANON_LOCATIONS, Governorate } from "@/lib/lebanon-locations";

interface TutorFiltersProps {
  selectedSubject: string;
  selectedGovernorate: string;
  selectedDistrict: string;
  selectedTeachingMode: string;
  onSubjectChange: (subject: string) => void;
  onGovernorateChange: (gov: string) => void;
  onDistrictChange: (dist: string) => void;
  onTeachingModeChange: (mode: string) => void;
}

export default function TutorFilters({
  selectedSubject,
  selectedGovernorate,
  selectedDistrict,
  selectedTeachingMode,
  onSubjectChange,
  onGovernorateChange,
  onDistrictChange,
  onTeachingModeChange,
}: TutorFiltersProps) {
  return (
    <div className="filter-container">
      <div className="filter-group">
        <label htmlFor="subject-filter" className="filter-label">Subject:</label>
        <select id="subject-filter" value={selectedSubject} onChange={(e) => onSubjectChange(e.target.value)} className="filter-select">
          <option value="All Subjects">All Subjects</option>
          {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="mode-filter" className="filter-label">Mode:</label>
        <select id="mode-filter" value={selectedTeachingMode} onChange={(e) => onTeachingModeChange(e.target.value)} className="filter-select">
          <option value="All Modes">All Modes</option>
          <option value="IN_PERSON">In Person</option>
          <option value="ONLINE">Online</option>
          <option value="BOTH">Both</option>
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="gov-filter" className="filter-label">Governorate:</label>
        <select id="gov-filter" value={selectedGovernorate} onChange={(e) => onGovernorateChange(e.target.value)} className="filter-select">
          <option value="All Governorates">All Governorates</option>
          {Object.keys(LEBANON_LOCATIONS).map((gov) => <option key={gov} value={gov}>{gov}</option>)}
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="dist-filter" className="filter-label">District:</label>
        <select id="dist-filter" value={selectedDistrict} onChange={(e) => onDistrictChange(e.target.value)} className="filter-select" disabled={selectedGovernorate === "All Governorates"}>
          <option value="All Districts">All Districts</option>
          {selectedGovernorate !== "All Governorates" && 
            LEBANON_LOCATIONS[selectedGovernorate as Governorate].map((dist) => (
              <option key={dist} value={dist}>{dist}</option>
            ))
          }
        </select>
      </div>
    </div>
  );
}
