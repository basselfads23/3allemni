// src/app/student/page.tsx

// This directive tells Next.js that this component runs on the client side (in the browser)
"use client";

// Import React hooks for managing state and side effects
import { useEffect, useState } from "react"; // useEffect runs code after render, useState manages component state

// BLOCK: TypeScript interface definition
// This defines the shape/structure of a Tutor object for type safety
interface Tutor {
  name: string; // Property: tutor's name must be a string
  subject: string; // Property: tutor's subject must be a string
  bio?: string;
}
// This interface ensures we only work with valid Tutor objects throughout the component

// BLOCK: Main component function
// This is the Student page component that displays all tutors from the database
export default function Home() {
  // export default makes this the page component, function keyword defines it

  // BLOCK: State management
  // Create state variable to store array of tutors fetched from database
  const [tutors, setTutors] = useState<Tutor[]>([]); // useState hook: tutors is the value, setTutors updates it, <Tutor[]> means array of Tutor objects, [] is initial empty array
  // This state will hold all tutors and trigger re-render when updated

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

  // BLOCK: JSX rendering - what gets displayed on the page
  return (
    // return statement sends JSX to be rendered
    <main className="page-container">
      {/* main tag with centered layout styles from global.css */}

      <div className="content-wrapper">
        {/* Container div with max width constraint from global.css */}

        <h1 className="page-title">Tutor Profiles</h1>
        {/* Page heading with styles from global.css */}

        {/* Conditional rendering: show list if tutors exist, otherwise show message */}
        {tutors.length > 0 ? ( // Ternary operator: condition ? ifTrue : ifFalse, .length gets array size
          <ul className="tutor-list">
            {/* Unordered list with spacing styles from global.css */}

            {/* Loop through tutors array and create list item for each */}
            {tutors.map(
              (
                tutor,
                index // .map() loops through array, tutor is current item, index is position
              ) => (
                <li key={index} className="tutor-item">
                  {/* List item card with styles from global.css, key helps React track items */}

                  <p className="tutor-name">Name: {tutor.name}</p>

                  <p className="tutor-subject">Subject: {tutor.subject}</p>
                  {/* Subject with styles from global.css */}

                  <p className="tutor-bio">Bio: {tutor.bio}</p>
                </li>
              )
            )}
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
