// src/app/tutor/page.tsx

// This directive tells Next.js that this component runs on the client side (in the browser)
"use client";

// Import React hook for managing component state
import { useState } from "react"; // useState creates and updates state variables

// BLOCK: Main component function
// This is the Tutor page component that displays a form to submit tutor information
export default function Home() {
  // export default makes this the page component, function keyword defines it

  // BLOCK: State management for form inputs
  // Create state variable to store tutor's name from input field
  const [name, setName] = useState(""); // useState hook: name is the current value, setName updates it, "" is initial empty string
  // This state holds the name input value and updates as user types

  // Create state variable to store tutor's subject from input field
  const [subject, setSubject] = useState(""); // useState hook: subject is the current value, setSubject updates it, "" is initial empty string
  // This state holds the subject input value and updates as user types

  // BLOCK: Form submission handler
  // Define async function to handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    // async keyword allows using await, e is the form event object, React.FormEvent is TypeScript type for form events

    // Prevent default form submission behavior (page reload)
    e.preventDefault(); // .preventDefault() stops the browser from refreshing the page

    // Make POST request to API with form data
    const res = await fetch("/api/submit", {
      // await pauses until fetch completes, fetch() makes HTTP request to /api/submit endpoint
      method: "POST", // HTTP method: POST is used to send/create data
      headers: {
        // headers object contains request metadata
        "Content-Type": "application/json", // Tell server we're sending JSON data
      },
      body: JSON.stringify({ name, subject }), // Convert JavaScript object {name, subject} to JSON string for transmission
    });
    // This fetch call sends tutor data to the API which saves it to Neon database

    // Check if request was successful (status 200-299)
    if (res.ok) {
      // .ok property is true when HTTP status is 200-299
      alert("Form submitted successfully!"); // Show success popup message to user
      setName(""); // Clear name input by setting state to empty string
      setSubject(""); // Clear subject input by setting state to empty string
    } else {
      // If request failed (status 400, 500, etc.)
      alert("Form submission failed."); // Show error popup message to user
    }
  };
  // This function sends form data to API and handles success/error feedback

  // BLOCK: JSX rendering - the form UI
  return (
    // return statement sends JSX to be rendered
    <main className="page-container">
      {/* main tag with centered layout styles from global.css */}

      <div className="content-wrapper-narrow">
        {/* Container div with narrow max width for forms from global.css */}

        <h1 className="page-title-sm">Tutor Registration</h1>
        {/* Page heading with smaller title styles from global.css */}

        <form onSubmit={handleSubmit} className="card form">
          {/* form with card styling and vertical layout from global.css, onSubmit triggers handleSubmit function */}

          {/* BLOCK: Name input field */}
          <div className="form-field">
            {/* Form field container with styles from global.css */}

            <label htmlFor="name" className="form-label">
              {/* Label with styles from global.css, htmlFor links to input id for accessibility */}
              Name
            </label>

            <input
              type="text" // input type: plain text field
              id="name" // unique identifier that matches label's htmlFor
              value={name} // Controlled input: value comes from state (makes React control the input)
              onChange={(e) => setName(e.target.value)} // onChange fires when user types, e is event object, e.target.value is new input value, setName updates state
              className="form-input" // Input styles from global.css including focus states
              required // HTML5 validation: field must be filled before submission
            />
          </div>
          {/* This block creates a labeled text input for tutor's name with two-way data binding */}

          {/* BLOCK: Subject input field */}
          <div className="form-field">
            {/* Form field container with styles from global.css */}

            <label htmlFor="subject" className="form-label">
              {/* Label with styles from global.css, htmlFor links to input id for accessibility */}
              Subject
            </label>

            <input
              type="text" // input type: plain text field
              id="subject" // unique identifier that matches label's htmlFor
              value={subject} // Controlled input: value comes from state (makes React control the input)
              onChange={(e) => setSubject(e.target.value)} // onChange fires when user types, e is event object, e.target.value is new input value, setSubject updates state
              className="form-input" // Input styles from global.css including focus states
              required // HTML5 validation: field must be filled before submission
            />
          </div>
          {/* This block creates a labeled text input for subject with two-way data binding */}

          {/* BLOCK: Submit button */}
          <button type="submit" className="form-button">
            {/* Button with styles from global.css, type submit triggers form's onSubmit event */}
            Submit
          </button>
          {/* This button submits the form and triggers validation */}
        </form>
        {/* This form collects tutor name and subject, then sends to API on submit */}
      </div>
    </main>
  );
  // This return block displays a centered form for tutors to register
}
// This component provides a registration form that saves tutor data to Neon database
