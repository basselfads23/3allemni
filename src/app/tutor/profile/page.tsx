// src/app/tutor/profile/page.tsx
// BLOCK: Tutor Profile Editing Page
// Page for tutors to update their profile

import TutorForm from "@/components/tutor/TutorForm";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getTutorByUserId } from "@/services/tutorService";
import Link from "next/link";

// BLOCK: Main page component
export default async function TutorProfilePage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/api/auth/signin");
  }

  // Fetch existing tutor profile if one exists
  const existingTutor = await getTutorByUserId(String(session.user.id));

  return (
    <main className="page-container">
      <div className="content-wrapper-narrow">
        <div className="flex justify-start mb-4">
          <Link href="/tutor/dashboard" className="header-link text-blue-600">
            ← Back to Dashboard
          </Link>
        </div>
        <h1 className="page-title-sm">
          {existingTutor ? "Edit Tutor Profile" : "Tutor Registration"}
        </h1>
        <TutorForm initialData={existingTutor} />
      </div>
    </main>
  );
}
