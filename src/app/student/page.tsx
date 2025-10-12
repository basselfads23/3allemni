// src/app/student/page.tsx

// This directive tells Next.js that this component runs on the client side (in the browser)
"use client";

// Import React hooks for managing state and side effects
import { useEffect, useState } from "react"; // useEffect runs code after render, useState manages component state
import Link from "next/link"; // Link: Next.js component for client-side navigation (no page reload)

// BLOCK: Import Tutor type from validations
// Import the Tutor type (includes id) for database records
import { Tutor } from "@/lib/validations"; // @/ is alias for src/, imports the type definition with id field

// BLOCK: Main component function
// This is the Student page component that displays all tutors from the database
export default function Home() {
  // export default makes this the page component, function keyword defines it

  // BLOCK: State management
  // Create state variable to store array of tutors fetched from database
  const [tutors, setTutors] = useState<Tutor[]>([]); // useState hook: tutors is the value, setTutors updates it, <Tutor[]> means array of Tutor objects (with id), [] is initial empty array
  // This state will hold all tutors and trigger re-render when updated

  // State variable to store the currently selected subject filter
  const [selectedSubject, setSelectedSubject] = useState<string>("All Subjects"); // useState<string>: stores a string value, default is "All Subjects" (shows all tutors)
  // When user selects a subject from dropdown, this state updates and triggers re-render with filtered tutors

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
          console.error("Failed to fetch tutors"); // console.error() prints to browser console
        }
      } catch (error) {
        // catch block runs if any error occurs in try block
        // Log any network or parsing errors
        console.error("Error fetching tutors:", error); // Log error object to console
      }
    };
    // This function fetches all tutors from the Neon database via the API

    // Execute the fetch function immediately
    fetchTutors(); // Call the function we just defined
  }, []); // Empty dependency array [] means this effect runs only once when component first loads
  // This useEffect block fetches tutors from the API when the page loads

  // BLOCK: Filter logic
  // Filter tutors based on selected subject
  const filteredTutors =
    selectedSubject === "All Subjects" // Check if "All Subjects" is selected
      ? tutors // If yes, show all tutors (no filtering)
      : tutors.filter((tutor) => tutor.subject === selectedSubject); // If no, filter tutors array to only include tutors whose subject matches selectedSubject
  // .filter() creates a new array containing only elements that pass the test
  // (tutor) => tutor.subject === selectedSubject: arrow function that returns true if tutor's subject matches selected subject
  // Result: filteredTutors contains only tutors teaching the selected subject

  // BLOCK: JSX rendering - what gets displayed on the page
  return (
    // return statement sends JSX to be rendered
    <main className="page-container">
      {/* main tag with centered layout styles from global.css */}

      <div className="content-wrapper">
        {/* Container div with max width constraint from global.css */}

        <h1 className="page-title">Tutor Profiles</h1>
        {/* Page heading with styles from global.css */}

        {/* BLOCK: Subject filter dropdown */}
        {/* Dropdown menu to filter tutors by subject */}
        <div className="filter-container">
          {/* Container div for filter dropdown */}
          <label htmlFor="subject-filter" className="filter-label">
            Filter by Subject:
          </label>
          {/* Label for the dropdown */}

          <select
            id="subject-filter"
            value={selectedSubject} // Controlled input: value comes from state
            onChange={(e) => setSelectedSubject(e.target.value)} // When user selects option, update state with new value
            className="filter-select">
            {/* onChange: event handler that runs when selection changes */}
            {/* e.target.value: the value of the selected option */}

            <option value="All Subjects">All Subjects</option>
            {/* Default option to show all tutors */}

            <option value="Physics">Physics</option>
            <option value="Chemistry">Chemistry</option>
            <option value="Biology">Biology</option>
            <option value="Maths">Maths</option>
            <option value="English">English</option>
            <option value="French">French</option>
            <option value="Arabic">Arabic</option>
            <option value="Social Sciences">Social Sciences</option>
            {/* Each option's value attribute is used for filtering */}
          </select>
        </div>

        {/* Conditional rendering: show list if tutors exist, otherwise show message */}
        {filteredTutors.length > 0 ? ( // Use filteredTutors instead of tutors - only shows tutors matching selected subject
          <ul className="tutor-list">
            {/* Unordered list with spacing styles from global.css */}

            {/* Loop through filtered tutors array and create list item for each */}
            {filteredTutors.map((tutor: Tutor) => (
              // .map() loops through array, tutor is current item typed as Tutor
              <li key={tutor.id} className="tutor-item">
                {/* key={tutor.id}: use unique id instead of index for better React performance */}
                {/* List item card with styles from global.css */}

                <Link href={`/tutors/${tutor.id}`} className="tutor-link">
                  {/* Link component for navigation without page reload */}
                  {/* href: destination URL - template literal creates /tutors/1, /tutors/2, etc. */}
                  {/* tutor.id: dynamic part of the URL */}

                  {/* BLOCK: Profile picture or placeholder */}
                  {/* Display profile picture if available, otherwise show placeholder with initials */}
                  {tutor.profilePictureUrl ? (
                    // If profile picture URL exists, show image
                    <img
                      src={tutor.profilePictureUrl}
                      alt={`${tutor.name}'s profile`}
                      className="tutor-thumbnail"
                    />
                  ) : (
                    // If no profile picture, show placeholder with first letter of name
                    <div className="tutor-thumbnail-placeholder">
                      {tutor.name.charAt(0).toUpperCase()}
                      {/* charAt(0): gets first character, toUpperCase(): makes it uppercase */}
                    </div>
                  )}

                  {/* BLOCK: Tutor information */}
                  {/* Container for name and subject */}
                  <div className="tutor-info">
                    <p className="tutor-name">Name: {tutor.name}</p>

                    <p className="tutor-subject">Subject: {tutor.subject}</p>
                    {/* Subject with styles from global.css */}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          // else clause of ternary
          <p className="empty-message">No tutors available.</p>
          // Empty state message with styles from global.css
        )}
      </div>
    </main>
  );
  // This return block displays either a list of tutors (if any exist) or a "no tutors" message
}
// This component fetches and displays all tutors from the Neon database
