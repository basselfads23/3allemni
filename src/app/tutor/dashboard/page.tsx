// src/app/tutor/dashboard/page.tsx
// Protected tutor dashboard for creating and editing profiles

"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import DashboardHeader from "@/components/tutor/DashboardHeader";
import TutorForm from "@/components/tutor/TutorForm";

interface TutorProfile {
  id: number;
  name: string;
  subject: string;
  bio?: string;
  price?: number;
  location?: string;
  profilePictureUrl?: string;
}

export default function TutorDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tutorProfile, setTutorProfile] = useState<TutorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<"create" | "edit">("create");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
      return;
    }

    if (status === "authenticated" && session?.user?.id) {
      fetchTutorProfile();
    }
  }, [status, session, router]);

  const fetchTutorProfile = async () => {
    try {
      const res = await fetch("/api/tutor/profile");

      if (res.ok) {
        const data = await res.json();
        setTutorProfile(data);
        setMode("edit");
      } else if (res.status === 404) {
        // No profile exists yet
        setMode("create");
      } else {
        console.error("Failed to fetch tutor profile");
      }
    } catch (error) {
      console.error("Error fetching tutor profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = () => {
    // Refresh the profile data after successful submission
    fetchTutorProfile();
  };

  if (status === "loading" || loading) {
    return (
      <main className="page-container">
        <div className="content-wrapper-narrow">
          <p className="loading-message">Loading dashboard...</p>
        </div>
      </main>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <main className="page-container">
      <div className="content-wrapper-narrow">
        <DashboardHeader
          userEmail={session.user?.email || ""}
          userName={session.user?.name}
        />

        <div style={{ marginTop: "2rem" }}>
          <h2 className="page-title-sm">
            {mode === "create" ? "Create Your Tutor Profile" : "Edit Your Profile"}
          </h2>

          <TutorForm
            mode={mode}
            initialData={tutorProfile || undefined}
            onSuccess={handleSuccess}
          />
        </div>
      </div>
    </main>
  );
}
