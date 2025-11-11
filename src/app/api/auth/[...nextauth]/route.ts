// src/app/api/auth/[...nextauth]/route.ts
// NextAuth.js v5 API route handler

import { handlers } from "@/auth";

export const { GET, POST } = handlers;
