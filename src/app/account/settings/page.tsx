// src/app/account/settings/page.tsx
// BLOCK: Account Settings Page
// Server Component to fetch user data and render the settings form

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AccountSettingsForm from "@/components/account/AccountSettingsForm";
import Link from "next/link";

export default async function AccountSettingsPage() {
  // 1. Authenticate session
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/api/auth/signin");
  }

  // 2. Fetch full user data from database
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      phoneNumber: true,
      role: true,
    }
  });

  if (!user) {
    redirect("/");
  }

  return (
    <main className="page-container">
      <div className="content-wrapper-narrow">
        <div className="flex justify-start mb-4">
          <Link 
            href={session.user.role === "TUTOR" ? "/tutor/dashboard" : "/parent"} 
            className="header-link text-blue-600"
          >
            ← Back to Dashboard
          </Link>
        </div>
        
        <h1 className="page-title-sm">Account Settings</h1>
        <p className="landing-text mb-8">Manage your general account information and contact details.</p>
        
        <AccountSettingsForm user={user} />
      </div>
    </main>
  );
}
