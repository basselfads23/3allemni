// src/middleware.ts
// NextAuth middleware for protecting routes

export { auth as middleware } from "@/auth";

export const config = {
  matcher: ["/tutor/dashboard/:path*"],
};
