// src/app/page.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [userType, setUserType] = useState("Tutor");

  const router = useRouter();

  const handleNext = () => {
    if (userType === "Tutor") {
      router.push("/tutor");
    } else {
      router.push("/student");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">
          Welcome to 3allemni!
        </h1>
        <p className="text-xl text-gray-600">
          Are you a tutor or a student/parent?
          <select
            className="form-input"
            value={userType}
            onChange={(e) => setUserType(e.target.value)}>
            <option value="Tutor">Tutor</option>
            <option value="Student">Student</option>
          </select>
        </p>
        <div className="user-type">
          <button className="form-input" onClick={handleNext}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
