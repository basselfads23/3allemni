// src/app/api/auth/signup/route.ts
// BLOCK: Sign-up API Route
// Creates a new user in Supabase Auth and mirrors them to the Prisma users table

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { apiLogger } from "@/lib/logger";
import { z } from "zod";

const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(2, "Name must be at least 2 characters").max(100).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = signupSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const { email, password, name } = validation.data;

    // Check if email is already registered in our DB
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    // Create user in Supabase Auth (auto-confirmed, no email verification step)
    const { data: supabaseData, error: supabaseError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });

    if (supabaseError || !supabaseData.user) {
      apiLogger.error("Supabase Auth user creation failed:", supabaseError);
      return NextResponse.json(
        { error: supabaseError?.message ?? "Failed to create account" },
        { status: 500 }
      );
    }

    // Mirror to Prisma users table (source of truth for app data)
    await prisma.user.create({
      data: {
        email,
        name: name ?? null,
        role: "TUTOR", // default role; user can change in Settings
      },
    });

    apiLogger.success(`New user registered: ${email}`);
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    apiLogger.error("Error in POST /api/auth/signup:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
