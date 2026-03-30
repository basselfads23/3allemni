// src/app/signup/page.tsx
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import SignUpForm from "@/components/auth/SignUpForm";

export const metadata = { title: "Sign Up — 3allemni" };

export default async function SignUpPage() {
  const session = await auth();
  if (session?.user) redirect("/");

  return (
    <main className="page-container">
      <SignUpForm />
    </main>
  );
}
