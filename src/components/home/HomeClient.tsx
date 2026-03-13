// src/components/home/HomeClient.tsx
// BLOCK: Client-side logic for Landing Page
// Handles role selection and navigation

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HomeClient() {
  const [userType, setUserType] = useState("Tutor");
  const router = useRouter();

  const handleNext = () => {
    if (userType === "Tutor") {
      router.push("/tutor");
    } else {
      router.push("/parent");
    }
  };

  return (
    <>
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
    </>
  );
}
