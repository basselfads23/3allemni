// src/components/layout/Header.tsx
// BLOCK: Global Header Component
// This component provides consistent navigation across all pages

import Link from "next/link";
import { auth } from "@/lib/auth";
import AuthButtons from "@/components/auth/AuthButtons";

export default async function Header() {
  const session = await auth();

  return (
    <header className="header">
      <div className="header-content flex items-center justify-between">
        <Link href="/" className="header-logo">
          3allemni
        </Link>

        <nav className="header-nav flex items-center gap-4">
          <Link href="/parent" className="header-link">
            Find a Tutor
          </Link>
          
          <AuthButtons session={session} />
        </nav>
      </div>
    </header>
  );
}
