// src/app/page.tsx
// BLOCK: Landing Page
// Allows users to choose their role (Tutor or Parent)

import HomeClient from "@/components/home/HomeClient";

export default async function Home() {
  return (
    <main>
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
