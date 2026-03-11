// src/components/tutor/TutorFilters.tsx
// BLOCK: Tutor Filters Component
// Provides dropdowns for filtering tutors by subject and location

import { SUBJECTS } from "@/lib/constants";

// BLOCK: Component props type definition
interface TutorFiltersProps {
  selectedSubject: string;
  selectedLocation: string;
  uniqueLocations: string[];
  onSubjectChange: (subject: string) => void;
  onLocationChange: (location: string) => void;
}

// BLOCK: TutorFilters component
// Renders subject and location filter dropdowns
export default function TutorFilters({
  selectedSubject,
  selectedLocation,
  uniqueLocations,
  onSubjectChange,
  onLocationChange,
}: TutorFiltersProps) {
  return (
    <div className="filter-container">
      {/* BLOCK: Subject filter dropdown */}
      <div className="filter-group">
        <label htmlFor="subject-filter" className="filter-label">
          Filter by Subject:
        </label>

        <select
          id="subject-filter"
          value={selectedSubject}
          onChange={(e) => onSubjectChange(e.target.value)}
          className="filter-select">
          <option value="All Subjects">All Subjects</option>

          {/* Dynamically generate subject options from constants */}
          {SUBJECTS.map((subject) => (
            <option key={subject} value={subject}>
              {subject}
            </option>
          ))}
        </select>
      </div>

      {/* BLOCK: Location filter dropdown */}
      <div className="filter-group">
        <label htmlFor="location-filter" className="filter-label">
          Filter by Location:
        </label>

        <select
          id="location-filter"
          value={selectedLocation}
          onChange={(e) => onLocationChange(e.target.value)}
          className="filter-select">
          <option value="All Locations">All Locations</option>

          {/* Dynamically generate options from unique locations */}
          {uniqueLocations.map((location) => (
            <option key={location} value={location}>
              {location}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
