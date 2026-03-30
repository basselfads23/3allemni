// src/components/layout/MobileNav.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";

type Props = {
  role?: string;
  isLoggedIn: boolean;
};

export default function MobileNav({ role, isLoggedIn }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const close = () => setIsOpen(false);

  return (
    <div className="mobile-nav-wrapper">
      <button
        className="mobile-menu-btn"
        onClick={() => setIsOpen((v) => !v)}
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {isOpen && (
        <nav className="mobile-menu-dropdown">
          {role === "PARENT" && (
            <Link href="/parent" className="mobile-menu-link" onClick={close}>Find a Tutor</Link>
          )}
          {role === "TUTOR" && (
            <>
              <Link href="/tutor/dashboard" className="mobile-menu-link font-semibold" onClick={close}>Dashboard</Link>
              <Link href="/tutor/profile" className="mobile-menu-link" onClick={close}>My Profile</Link>
            </>
          )}
          {isLoggedIn && (role === "ADMIN" || role === "MASTER_ADMIN") && (
            <Link href="/admin" className="mobile-menu-link" style={{ color: "var(--text-accent)" }} onClick={close}>
              Admin Dashboard
            </Link>
          )}
          {isLoggedIn && (
            <>
              <Link href="/messages" className="mobile-menu-link" onClick={close}>Messages</Link>
              <Link href="/account/settings" className="mobile-menu-link" onClick={close}>Settings</Link>
              <button
                className="mobile-menu-link text-left text-red-500 w-full"
                onClick={() => { close(); signOut({ callbackUrl: "/" }); }}
              >
                Sign Out
              </button>
            </>
          )}
          {!isLoggedIn && (
            <>
              <Link href="/signin" className="mobile-menu-link font-semibold" style={{ color: "var(--text-accent)" }} onClick={close}>Sign In</Link>
              <Link href="/signup" className="mobile-menu-link" onClick={close}>Sign Up</Link>
            </>
          )}
        </nav>
      )}
    </div>
  );
}
