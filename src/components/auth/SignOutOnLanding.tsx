// src/components/auth/SignOutOnLanding.tsx
// BLOCK: Force Sign-Out Component
// Signs the user out automatically when this component mounts

"use client";

import { useEffect } from "react";
import { signOut } from "next-auth/react";

export default function SignOutOnLanding() {
  useEffect(() => {
    // We call signOut() to clear the session cookies
    // redirect: true will cause the page to reload or go to the callback URL
    // This helps in clearing any persistent sessions for debugging
    signOut({ callbackUrl: "/", redirect: true });
  }, []);

  return (
    <div className="fixed inset-0 bg-white/50 backdrop-blur-sm z-[9999] flex items-center justify-center">
      <p className="loading-message">Cleaning up session...</p>
    </div>
  );
}
