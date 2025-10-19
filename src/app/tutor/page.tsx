// src/app/tutor/page.tsx
// BLOCK: Tutor Registration Page
// Page for tutors to register on the platform

import TutorForm from "@/components/tutor/TutorForm";

// BLOCK: Main page component
export default function TutorPage() {
  return (
    <main className="page-container">
      <div className="content-wrapper-narrow">
        <h1 className="page-title-sm">Tutor Registration</h1>
        <TutorForm />
      </div>
    </main>
  );
}
