// src/components/home/HomeClient.tsx
// BLOCK: Client-side logic for Landing Page
// Handles role selection and navigation

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HomeClient() {
  const [userType, setUserType] = useState("Tutor");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleNext = () => {
    setIsLoading(true);
    if (userType === "Tutor") {
      router.push("/tutor/dashboard");
    } else {
      router.push("/parent");
    }
  };

  return (
    <>
      <select
        className="landing-select"
        value={userType}
        onChange={(e) => setUserType(e.target.value)}
        disabled={isLoading}
      >
        <option value="Tutor">Tutor</option>
        <option value="Parent">Parent</option>
      </select>
      <button className="landing-button" onClick={handleNext} disabled={isLoading}>
        {isLoading ? "Loading..." : "Next"}
      </button>
    </>
  );
}
