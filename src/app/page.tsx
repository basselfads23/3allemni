// src/app/page.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [userType, setUserType] = useState("Tutor");

  const router = useRouter();

  const handleNext = () => {
    if (userType === "Tutor") {
      router.push("/tutor/dashboard");
    } else {
      router.push("/parent");
    }
  };

  return (
    <div className="landing-container">
      <div className="landing-content">
        <h1 className="landing-title">Welcome to 3allemni!</h1>
        <p className="landing-text">Are you a tutor or a student/parent?</p>
        <select
          className="landing-select"
          value={userType}
          onChange={(e) => setUserType(e.target.value)}>
          <option value="Tutor">Tutor</option>
          <option value="Parent">Parent</option>
        </select>
        <button className="landing-button" onClick={handleNext}>
          Next
        </button>
      </div>
    </div>
  );
}
