// src/app/api/upload/route.ts
// BLOCK: API Route - Generic File Upload
// Handles file uploads to Vercel Blob storage and returns the URL

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { uploadDocument } from "@/services/uploadService";
import { auth } from "@/lib/auth";
import { apiLogger } from "@/lib/logger";

// BLOCK: POST Handler Function
export async function POST(req: NextRequest) {
  apiLogger.info("POST /api/upload - Function called");

  try {
    // 1. Authenticate session
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // 2. Parse FormData
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return new NextResponse("No file provided", { status: 400 });
    }

    // 3. Upload using service
    const url = await uploadDocument(file);

    apiLogger.success("File uploaded successfully to:", url);
    return NextResponse.json({ url }, { status: 200 });

  } catch (error) {
    apiLogger.error("Error in /api/upload:", error);
    const message = error instanceof Error ? error.message : "Upload failed";
    return new NextResponse(message, { status: 500 });
  }
}
