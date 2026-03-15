// src/app/tutor/dashboard/page.tsx
// BLOCK: Tutor Dashboard Page
// The main landing area for tutors after logging in

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getTutorByUserId } from "@/services/tutorService";
import Link from "next/link";

export default async function TutorDashboard() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/api/auth/signin");
  }

  // Fetch existing tutor profile if one exists
  const existingTutor = await getTutorByUserId(String(session.user.id));

  return (
    <main className="page-container">
      <div className="content-wrapper-narrow">
        <h1 className="page-title">Welcome, {session.user.name}!</h1>
        
        <div className="card shadow-md">
          <h2 className="page-title-sm">Tutor Dashboard</h2>
          
          <div className="flex flex-col gap-6 items-center">
            {existingTutor ? (
              <div className="text-center">
                <p className="landing-text mb-4">Your profile is active as a <strong>{existingTutor.subject}</strong> tutor.</p>
                <div className="flex flex-col gap-3">
                  <Link href={`/tutors/${existingTutor.id}`} className="form-button text-center no-underline block">
                    View Public Profile
                  </Link>
                  <Link href="/tutor/profile" className="header-link text-blue-600 font-semibold border border-blue-600 rounded-md px-4 py-2 hover:bg-blue-50 transition-colors text-center">
                    Edit Profile
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <p className="landing-text mb-6">You haven&apos;t created a tutor profile yet. Set one up to start being discovered by parents!</p>
                <Link href="/tutor/profile" className="form-button text-center no-underline block px-8">
                  Create Tutor Profile
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
