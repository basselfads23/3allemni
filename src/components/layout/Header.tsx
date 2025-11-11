// src/components/layout/Header.tsx
// BLOCK: Global Header Component
// This component provides consistent navigation across all pages

import Link from "next/link";
export default function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <Link href="/" className="header-logo">
          3allemni
        </Link>

        <nav className="header-nav">
          <Link href="/parent" className="header-link">
            Find a Tutor
          </Link>
          <Link href="/tutor" className="header-link">
            Become a Tutor
          </Link>
        </nav>
      </div>
    </header>
  );
}
