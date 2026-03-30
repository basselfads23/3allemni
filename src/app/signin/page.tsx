// src/app/signin/page.tsx
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import SignInForm from "@/components/auth/SignInForm";

export const metadata = { title: "Sign In — 3allemni" };

export default async function SignInPage() {
  const session = await auth();
  if (session?.user) redirect("/");

  return (
    <main className="page-container">
      {/* Suspense required because SignInForm calls useSearchParams() */}
      <Suspense>
        <SignInForm />
      </Suspense>
    </main>
  );
}
