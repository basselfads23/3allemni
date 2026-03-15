// src/components/layout/Header.tsx
// BLOCK: Global Header Component
// This component provides consistent navigation across all pages

import Link from "next/link";
import { auth, signIn, signOut } from "@/lib/auth";

export default async function Header() {
  const session = await auth();

  return (
    <header className="header">
      <div className="header-content">
        {/* Left section: Logo and navigation links */}
        <div className="header-left">
          <Link href="/" className="header-logo">
            3allemni
          </Link>

          <nav className="header-nav">
            <Link href="/parent" className="header-link">
              Find a Tutor
            </Link>
            {session && (
              <Link href="/tutor/dashboard" className="header-link font-semibold">
                Dashboard
              </Link>
            )}
          </nav>
        </div>

        {/* Right section: Authentication buttons */}
        <div className="header-auth">
          {session ? (
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/parent" });
              }}
            >
              <button type="submit" className="header-link text-red-500">
                Sign Out
              </button>
            </form>
          ) : (
            <form
              action={async () => {
                "use server";
                await signIn("google", { redirectTo: "/tutor/dashboard" });
              }}
            >
              <button type="submit" className="header-link text-blue-600 font-semibold">
                Sign In / Register
              </button>
            </form>
          )}
        </div>
      </div>
    </header>
  );
}
