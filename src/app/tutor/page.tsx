// src/app/tutor/page.tsx
// BLOCK: Tutor Registration Page
// Page for tutors to register on the platform

import TutorForm from "@/components/tutor/TutorForm";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getTutorByUserId } from "@/services/tutorService";

// BLOCK: Main page component
export default async function TutorPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/api/auth/signin");
  }

  // Fetch existing tutor profile if one exists
  const existingTutor = await getTutorByUserId(String(session.user.id));

  return (
    <main className="page-container">
      <div className="content-wrapper-narrow">
        <h1 className="page-title-sm">
          {existingTutor ? "Edit Tutor Profile" : "Tutor Registration"}
        </h1>
        <TutorForm initialData={existingTutor} />
      </div>
    </main>
  );
}
