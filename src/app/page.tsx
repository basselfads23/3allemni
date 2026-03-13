// src/app/page.tsx
// BLOCK: Landing Page
// Allows users to choose their role (Tutor or Parent)
// Added forced sign-out logic as requested for step-by-step debugging

import { auth } from "@/lib/auth";
import HomeClient from "@/components/home/HomeClient";
import SignOutOnLanding from "@/components/auth/SignOutOnLanding";

export default async function Home() {
  const session = await auth();

  return (
    <main>
      {/* If user lands here and is signed in, force sign out for debugging */}
      {session && <SignOutOnLanding />}
      
      <div className="landing-container">
        <div className="landing-content">
          <h1 className="landing-title">Welcome to 3allemni!</h1>
          <p className="landing-text">Are you a tutor or a parent?</p>
          <HomeClient />
        </div>
      </div>
    </main>
  );
}
