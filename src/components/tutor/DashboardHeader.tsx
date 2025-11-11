// src/components/tutor/DashboardHeader.tsx
// Dashboard header with user info and logout button

"use client";

import { signOut } from "next-auth/react";

interface DashboardHeaderProps {
  userEmail: string;
  userName?: string | null;
}

export default function DashboardHeader({ userEmail, userName }: DashboardHeaderProps) {
  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <div className="dashboard-header">
      <div>
        <h1 className="page-title-sm">Tutor Dashboard</h1>
        <p className="dashboard-user-info">
          Logged in as: {userName || userEmail}
        </p>
      </div>
      <button onClick={handleSignOut} className="logout-button">
        Sign Out
      </button>
    </div>
  );
}
