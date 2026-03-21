// src/app/admin/page.tsx
// BLOCK: Admin Dashboard Page
// Server-side protection and layout for the system admin dashboard

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminDashboard from "@/components/admin/AdminDashboard";

export default async function AdminPage() {
  // 1. Strict admin-only access check
  const session = await auth();
  const isAdmin = session?.user?.id && (session.user.role === "ADMIN" || session.user.role === "MASTER_ADMIN");

  if (!isAdmin) {
    redirect("/");
  }

  return (
    <main className="page-container">
      <div className="content-wrapper">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Admin Control Panel</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Review tutor applications and verify educational credentials.</p>
        </div>

        <AdminDashboard currentUserId={session?.user?.id} currentUserRole={session?.user?.role as any} />
      </div>
    </main>
  );
}
