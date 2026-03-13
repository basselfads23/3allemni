// src/components/auth/AuthButtons.tsx
// BLOCK: Auth Buttons Component
// Client-side component for Sign In and Sign Out buttons
// Using client-side calls for better reliability with custom domains

"use client";

import Link from "next/link";
import { signIn, signOut } from "next-auth/react";
import { Session } from "next-auth";

export default function AuthButtons({ session }: { session: Session | null }) {
  if (session) {
    return (
      <>
        <Link href="/tutor" className="header-link font-semibold">
          Dashboard
        </Link>
        <button 
          onClick={() => signOut({ callbackUrl: "/parent" })} 
          className="header-link text-red-500"
        >
          Sign Out
        </button>
      </>
    );
  }

  return (
    <button 
      onClick={() => signIn("google", { callbackUrl: "/tutor" })} 
      className="header-link text-blue-600 font-semibold"
    >
      Sign In / Register
    </button>
  );
}
