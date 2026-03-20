// src/app/tutor/profile/page.tsx
// BLOCK: Tutor Profile Editing Page
// Separate page for tutors to manage their professional details

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getTutorByUserId } from "@/services/tutorService";
import TutorForm from "@/components/tutor/TutorForm";
import Link from "next/link";

export default async function TutorProfilePage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/api/auth/signin");
  }

  // Strict role protection
  if (session.user.role === "PARENT") {
    redirect("/parent");
  }

  // Fetch existing tutor profile if one exists
  const existingTutor = await getTutorByUserId(session.user.id);

  return (
    <main className="page-container">
      <div className="content-wrapper-narrow">
        <div className="flex justify-start mb-4">
          <Link href="/tutor/dashboard" className="header-link text-blue-600">
            ← Back to Dashboard
          </Link>
        </div>
        
        <h1 className="page-title-sm">
          {existingTutor ? "My Tutor Profile" : "Tutor Registration"}
        </h1>
        <p className="landing-text mb-8">
          {existingTutor 
            ? "Update your teaching details and availability." 
            : "Fill out the form below to start appearing in search results."}
        </p>
        
        <TutorForm initialData={existingTutor} />
      </div>
    </main>
  );
}
