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
            {/* Common links for all logged-in users */}
            {session?.user?.role === "PARENT" && (
              <Link href="/parent" className="header-link">
                Find a Tutor
              </Link>
            )}

            {session?.user?.role === "TUTOR" && (
              <>
                <Link href="/tutor/dashboard" className="header-link font-semibold">
                  Dashboard
                </Link>
                <Link href="/tutor/profile" className="header-link">
                  My Profile
                </Link>
              </>
            )}

            {session && (
              <>
                {session.user.role === "ADMIN" && (
                  <Link href="/admin" className="header-link text-purple-600 font-bold">
                    Admin Dashboard
                  </Link>
                )}
                <Link href="/messages" className="header-link">
                  Messages
                </Link>
                <Link href="/account/settings" className="header-link">
                  Settings
                </Link>
              </>
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
