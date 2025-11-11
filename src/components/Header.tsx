// src/components/Header.tsx
// BLOCK: Global Header Component
// This component provides consistent navigation across all pages

import Link from "next/link"; // Next.js Link component for client-side navigation

// BLOCK: Header component definition
// Export default Header component that displays app logo and navigation links
export default function Header() {
  return (
    <header className="header">
      {/* Container for header content */}
      <div className="header-content">
        {/* BLOCK: Logo/Brand name on the left */}
        <Link href="/" className="header-logo">
          3allemni
        </Link>

        {/* BLOCK: Navigation links on the right */}
        <nav className="header-nav">
          <Link href="/parent" className="header-link">
            Find a Tutor
          </Link>
          <Link href="/tutor/dashboard" className="header-link">
            Become a Tutor
          </Link>
        </nav>
      </div>
    </header>
  );
}
