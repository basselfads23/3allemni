// src/app/student/page.tsx
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
// This is the Student page component that displays all tutors from the database
export default function Home() {
  // export default makes this the page component, function keyword defines it

  // BLOCK: State management
  // Create state variable to store array of tutors fetched from database
  const [tutors, setTutors] = useState<Tutor[]>([]); // useState hook: tutors is the value, setTutors updates it, <Tutor[]> means array of Tutor objects (with id), [] is initial empty array
  // This state will hold all tutors and trigger re-render when updated

  // State variable to store the currently selected subject filter
  const [selectedSubject, setSelectedSubject] =
    useState<string>("All Subjects"); // useState<string>: stores a string value, default is "All Subjects" (shows all tutors)
  // When user selects a subject from dropdown, this state updates and triggers re-render with filtered tutors

  // State variable to store the currently selected location filter
  const [selectedLocation, setSelectedLocation] =
    useState<string>("All Locations"); // useState<string>: stores a string value, default is "All Locations" (shows all tutors)
  // When user selects a location from dropdown, this state updates and triggers re-render with filtered tutors

  // BLOCK: Side effect - fetch data when component mounts
  // useEffect runs code after the component renders on the page
  useEffect(() => {
    // Arrow function syntax: () => {}

    // BLOCK: Async function to fetch tutors from API
    // Define async function to make HTTP request to get tutors
    const fetchTutors = async () => {
      // async keyword allows using await inside, arrow function syntax
      try {
        // try-catch block for error handling

        // Make GET request to /api/tutors endpoint
        const response = await fetch("/api/tutors"); // await pauses until fetch completes, fetch() makes HTTP request

        // Check if request was successful (status 200-299)
        if (response.ok) {
          // .ok property is true when status is 200-299

          // Parse JSON response body into JavaScript object
          const data = await response.json(); // .json() converts JSON string to JavaScript array/object

          // Update state with fetched tutors (triggers re-render)
          setTutors(data); // Call state setter function to update tutors array
        } else {
          // Log error message if request failed
          clientLogger.error("Failed to fetch tutors");
        }
      } catch (error) {
        // catch block runs if any error occurs in try block
        // Log any network or parsing errors
        clientLogger.error("Error fetching tutors:", error);
      }
    };
    // This function fetches all tutors from the Neon database via the API

    // Execute the fetch function immediately
    fetchTutors(); // Call the function we just defined
  }, []); // Empty dependency array [] means this effect runs only once when component first loads
  // This useEffect block fetches tutors from the API when the page loads

  // BLOCK: Extract unique locations for filter dropdown
  const uniqueLocations = getUniqueValues(tutors, "location")
    .filter((location): location is string => location !== null)
    .sort();

  // BLOCK: Filter logic
  // Filter tutors based on selected subject AND location
  const filteredTutors = tutors.filter((tutor) => {
    // Check subject filter
    const matchesSubject =
      selectedSubject === "All Subjects" || tutor.subject === selectedSubject;

    // Check location filter
    const matchesLocation =
      selectedLocation === "All Locations" ||
      tutor.location === selectedLocation;

    // Return true only if tutor matches both filters
    return matchesSubject && matchesLocation;
  });
  // Result: filteredTutors contains only tutors matching both subject and location filters

  // BLOCK: JSX rendering
  return (
    <main className="page-container">
      <div className="content-wrapper">
        <h1 className="page-title">Tutor Profiles</h1>

        {/* BLOCK: Filter dropdowns */}
        <TutorFilters
          selectedSubject={selectedSubject}
          selectedLocation={selectedLocation}
          uniqueLocations={uniqueLocations}
          onSubjectChange={setSelectedSubject}
          onLocationChange={setSelectedLocation}
        />

        {/* BLOCK: Tutor list */}
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
