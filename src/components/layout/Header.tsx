// src/components/layout/Header.tsx
// BLOCK: Global Header Component
// This component provides consistent navigation across all pages

import Link from "next/link";
import { auth, signOut } from "@/lib/auth";
import ThemeToggle from "@/components/shared/ThemeToggle";
import MobileNav from "@/components/layout/MobileNav";

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
                {(session.user.role === "ADMIN" || session.user.role === "MASTER_ADMIN") && (
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
            <ThemeToggle />
          </nav>
        </div>

        {/* Right section: Authentication buttons (desktop) */}
        <div className="header-auth">
          {session ? (
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <button type="submit" className="header-link text-red-500">
                Sign Out
              </button>
            </form>
          ) : (
            <div className="flex items-center gap-4">
              <a href="/signin" className="header-link font-semibold" style={{ color: "var(--text-accent)" }}>
                Sign In
              </a>
              <a
                href="/signup"
                className="px-4 py-1.5 rounded-lg text-sm font-semibold text-white transition-colors"
                style={{ background: "var(--text-accent)" }}
              >
                Sign Up
              </a>
            </div>
          )}
        </div>

        {/* Mobile navigation (hamburger) */}
        <MobileNav role={session?.user?.role} isLoggedIn={!!session} />
      </div>
    </header>
  );
}
