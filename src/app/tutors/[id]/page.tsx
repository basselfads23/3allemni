// src/app/tutors/[id]/page.tsx
// BLOCK: Tutor Profile Page
// This page displays detailed information about a single tutor
// Route: /tutors/[id] where [id] is the tutor's database ID

"use client";

// BLOCK: Imports
// Import React hooks for managing state, side effects, and URL parameters
import { useEffect, useState } from "react"; // useEffect: runs code after render, useState: manages component state
import { useParams } from "next/navigation"; // useParams: gets URL parameters like [id]
import Link from "next/link"; // Link: Next.js component for client-side navigation
import Image from "next/image"; // Image: Next.js component for optimized images

// Import Tutor type from validations
import { Tutor } from "@/lib/validations"; // Type definition for tutor data (includes id)
import { clientLogger } from "@/lib/logger";

// BLOCK: Main component function
// This component fetches and displays a single tutor's profile
export default function TutorProfile() {
  // BLOCK: Hooks for URL parameters
  // Get the dynamic [id] parameter from the URL
  const params = useParams(); // useParams(): returns object with route parameters
  const id = params.id as string; // Extract id from params object and type it as string
  // Example: if URL is /tutors/5, then id = "5"

  // BLOCK: State management
  // State to store the tutor data fetched from API
  const [tutor, setTutor] = useState<Tutor | null>(null);
  // Tutor | null: tutor can be either a Tutor object (with id) or null (if not loaded yet)
  // Initial value: null (no data yet)

  // State to track loading status
  const [loading, setLoading] = useState<boolean>(true);
  // boolean type: can only be true or false
  // Initial value: true (we start in loading state)

  // State to track error status
  const [error, setError] = useState<string | null>(null);
  // string | null: error can be an error message (string) or null (no error)
  // Initial value: null (no error yet)

  // BLOCK: Fetch tutor data when component mounts
  // useEffect runs after the component renders
  useEffect(() => {
    // BLOCK: Async function to fetch single tutor from API
    const fetchTutor = async () => {
      // async function: allows using await inside
      try {
        // try-catch: handles errors gracefully
        clientLogger.info("Fetching tutor with ID:", id);

        // Make GET request to our API endpoint
        const response = await fetch(`/api/tutor/${id}`);
        // Template literal: `/api/tutor/${id}` becomes `/api/tutor/5` if id is "5"
        // await: pauses until fetch completes

        // Check if request was successful
        if (response.ok) {
          // response.ok: true if status is 200-299
          const data = await response.json(); // Parse JSON response
          clientLogger.success("Tutor data received:", data);
          setTutor(data); // Update state with tutor data
        } else {
          // Request failed (404, 500, etc.)
          clientLogger.error("Failed to fetch tutor");
          setError("Tutor not found"); // Set error message
        }
      } catch (err) {
        // Catch any network or parsing errors
        clientLogger.error("Error fetching tutor:", err);
        setError("Failed to load tutor profile"); // Set error message
      } finally {
        // finally block: runs whether try succeeded or catch caught an error
        setLoading(false); // Always set loading to false when done
      }
    };

    fetchTutor(); // Call the function to start fetching
  }, [id]); // Dependency array: [id] means re-run effect if id changes
  // This ensures we fetch new data if the URL changes to a different tutor

  // BLOCK: Loading state UI
  // Show loading message while data is being fetched
  if (loading) {
    return (
      <main className="page-container">
        <div className="content-wrapper-narrow">
          <p className="loading-message">Loading tutor profile...</p>
        </div>
      </main>
    );
  }

  // BLOCK: Error state UI
  // Show error message if something went wrong
  if (error) {
    return (
      <main className="page-container">
        <div className="content-wrapper-narrow">
          <div className="card error-card">
            <h1 className="page-title-sm">Error</h1>
            <p className="error-text">{error}</p>
            {/* Display the error message from state */}

            <Link href="/student" className="back-link">
              ← Back to Tutors List
            </Link>
            {/* Link back to student page */}
          </div>
        </div>
      </main>
    );
  }

  // BLOCK: No tutor found UI
  // Show message if tutor is still null after loading finished
  if (!tutor) {
    return (
      <main className="page-container">
        <div className="content-wrapper-narrow">
          <div className="card">
            <p>Tutor not found.</p>
            <Link href="/student" className="back-link">
              ← Back to Tutors List
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // BLOCK: Main profile UI
  // If we reach here, we have valid tutor data - display it!
  return (
    <main className="page-container">
      <div className="content-wrapper-narrow">
        {/* Back link to return to tutors list */}
        <Link href="/student" className="back-link">
          ← Back to Tutors List
        </Link>

        {/* Profile card with tutor details */}
        <div className="card profile-card">
          {/* BLOCK: Profile picture or placeholder */}
          {/* Display large profile picture prominently at the top */}
          {tutor.profilePictureUrl ? (
            // If profile picture URL exists, show optimized image
            <Image
              src={tutor.profilePictureUrl}
              alt={`${tutor.name}'s profile`}
              width={144}
              height={144}
              className="profile-picture"
              priority
            />
          ) : (
            // If no profile picture, show placeholder with first letter of name
            <div className="profile-picture-placeholder">
              {tutor.name.charAt(0).toUpperCase()}
              {/* charAt(0): gets first character, toUpperCase(): makes it uppercase */}
            </div>
          )}

          {/* Tutor name as main heading */}
          <h1 className="profile-name">{tutor.name}</h1>

          {/* Subject badge */}
          <div className="profile-subject-badge">{tutor.subject}</div>

          {/* Details section */}
          <div className="profile-details">
            {/* Price section - only show if price exists */}
            {tutor.price && (
              <div className="profile-detail-item">
                <span className="profile-detail-label">Price:</span>
                <p className="profile-detail-value">
                  ${tutor.price.toFixed(2)}/hour
                </p>
              </div>
            )}

            {/* Location section - only show if location exists */}
            {tutor.location && (
              <div className="profile-detail-item">
                <span className="profile-detail-label">Location:</span>
                <p className="profile-detail-value">{tutor.location}</p>
              </div>
            )}

            {/* Email section */}
            <div className="profile-detail-item">
              <span className="profile-detail-label">Email:</span>
              <a href={`mailto:${tutor.email}`} className="profile-email">
                {tutor.email}
              </a>
              {/* mailto: link opens user's email client with tutor's email pre-filled */}
            </div>

            {/* Bio section - only show if bio exists */}
            {tutor.bio && (
              // tutor.bio && : only render if bio is not empty/null/undefined
              <div className="profile-detail-item">
                <span className="profile-detail-label">About:</span>
                <p className="profile-bio">{tutor.bio}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
// This component handles loading state, error state, and displays tutor profile when data is available
