// src/app/tutors/[id]/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Tutor } from "@/lib/validations";
import { clientLogger } from "@/lib/logger";

export default function TutorProfile() {
  const params = useParams();
  const id = params.id as string;
  const [tutor, setTutor] = useState<Tutor | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTutor = async () => {
      try {
        clientLogger.info("Fetching tutor with ID:", id);

        const response = await fetch(`/api/tutor/${id}`);

        if (response.ok) {
          const data = await response.json();
          clientLogger.success("Tutor data received:", data);
          setTutor(data);
        } else {
          clientLogger.error("Failed to fetch tutor");
          setError("Tutor not found");
        }
      } catch (err) {
        clientLogger.error("Error fetching tutor:", err);
        setError("Failed to load tutor profile");
      } finally {
        setLoading(false);
      }
    };

    fetchTutor();
  }, [id]);
  if (loading) {
    return (
      <main className="page-container">
        <div className="content-wrapper-narrow">
          <p className="loading-message">Loading tutor profile...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="page-container">
        <div className="content-wrapper-narrow">
          <div className="card error-card">
            <h1 className="page-title-sm">Error</h1>
            <p className="error-text">{error}</p>

            <Link href="/parent" className="back-link">
              ← Back to Tutors List
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (!tutor) {
    return (
      <main className="page-container">
        <div className="content-wrapper-narrow">
          <div className="card">
            <p>Tutor not found.</p>
            <Link href="/parent" className="back-link">
              ← Back to Tutors List
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="page-container">
      <div className="content-wrapper-narrow">
        <Link href="/parent" className="back-link">
          ← Back to Tutors List
        </Link>

        <div className="card profile-card">
          {tutor.profilePictureUrl ? (
            <Image
              src={tutor.profilePictureUrl}
              alt={`${tutor.name}'s profile`}
              width={144}
              height={144}
              className="profile-picture"
              priority
            />
          ) : (
            <div className="profile-picture-placeholder">
              {tutor.name.charAt(0).toUpperCase()}
            </div>
          )}

          <h1 className="profile-name">{tutor.name}</h1>

          <div className="profile-subject-badge">{tutor.subject}</div>

          <div className="profile-details">
            <div className="profile-detail-item">
              <span className="profile-detail-label">Rate:</span>
              <p className="profile-detail-value">
                ${tutor.hourlyRate.toFixed(2)}/hour
              </p>
            </div>

            <div className="profile-detail-item">
              <span className="profile-detail-label">Teaching Mode:</span>
              <p className="profile-detail-value">
                {tutor.teachingMode === "IN_PERSON" ? "In Person" : 
                 tutor.teachingMode === "ONLINE" ? "Online" : "In Person & Online"}
              </p>
            </div>

            <div className="profile-detail-item">
              <span className="profile-detail-label">Location:</span>
              <p className="profile-detail-value">
                {[tutor.city, tutor.district, tutor.governorate].filter(Boolean).join(", ")}
              </p>
            </div>

            {tutor.bio && (
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
