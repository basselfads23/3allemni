// src/app/tutor/page.tsx
// BLOCK: Tutor Root Page Redirect
// Redirects the base /tutor route to the tutor dashboard

import { redirect } from "next/navigation";

export default function TutorRootPage() {
  redirect("/tutor/dashboard");
}
