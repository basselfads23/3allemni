// src/app/api/submit/route.ts
// BLOCK: API Route - Submit Tutor
// This API route handles POST requests to submit new tutors to the database
// Route URL: /api/submit
// Method: POST
// Request body: FormData with name, email, subject, bio, and optional profilePicture file
// Response: Returns created tutor object with 200, or error message with 400/500

// CRITICAL: Force Node.js runtime (Prisma doesn't work in Edge runtime)
export const runtime = "nodejs"; // Tells Next.js to use Node.js runtime instead of Edge
export const dynamic = "force-dynamic"; // Disable static optimization for this route

// Import Next.js server types for API routes
import { NextRequest, NextResponse } from "next/server"; // NextRequest: typed request object, NextResponse: helper for creating responses

// Import Prisma client instance to interact with database
import { prisma } from "@/lib/prisma"; // @/ is path alias for src/, prisma is singleton client instance

// Import Zod validation schema
import { tutorSchema } from "@/lib/validations"; // Import validation rules to check data before saving to database

// Import Vercel Blob for file uploads
import { put } from "@vercel/blob"; // put function uploads files to Vercel Blob storage

// BLOCK: POST Handler Function
// Export async function to handle POST requests to /api/submit endpoint
export async function POST(req: NextRequest) {
  // export: makes function available to Next.js router
  // async: allows using await for asynchronous operations
  // POST: function name must match HTTP method
  // req: NextRequest object containing request data (headers, body, etc.)

  // DEBUG: Log that function was called
  console.log("🔵 [API] POST /api/submit - Function called");

  try {
    // try-catch block: handles errors gracefully and prevents crashes

    // BLOCK: Parse and extract request data from FormData
    // Parse FormData from request body (contains both text fields and file)
    console.log("🔵 [API] Parsing FormData from request...");
    const formData = await req.formData(); // await: waits for FormData parsing to complete
    console.log("🔵 [API] FormData parsed successfully");

    // Extract text fields from FormData
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const subject = formData.get("subject") as string;
    const bio = formData.get("bio") as string;
    const profilePictureFile = formData.get("profilePicture") as File | null;

    console.log(
      "🔵 [API] Extracted fields - name:",
      name,
      "email:",
      email,
      "subject:",
      subject,
      "bio:",
      bio,
      "has profile picture:",
      !!profilePictureFile
    );

    // BLOCK: Validate data with Zod schema
    // Use Zod to validate the text fields against our schema rules
    console.log("🔵 [API] Validating data with Zod...");
    const validation = tutorSchema.safeParse({ name, email, subject, bio });
    // safeParse(): validates data without throwing errors
    // Returns: { success: true, data: validatedData } OR { success: false, error: zodError }

    // Check if validation failed
    if (!validation.success) {
      // !validation.success means data doesn't match our schema rules
      console.log("🔴 [API] Validation failed:", validation.error);

      // Extract first error message to show to client
      const firstError = validation.error.issues[0]; // Get first validation error from array
      const errorMessage = `${firstError.path.join(".")}: ${firstError.message}`;
      // firstError.path: field that failed (e.g., ["email"])
      // firstError.message: error message (e.g., "Please enter a valid email address")
      // .join("."): converts ["email"] to "email"

      console.log("🔴 [API] Error message:", errorMessage);
      return new NextResponse(errorMessage, { status: 400 });
      // status: 400 means Bad Request (client sent invalid data)
    }

    // If we reach here, validation passed!
    // Use the validated data (Zod has cleaned and type-checked it)
    const validatedData = validation.data;
    // validation.data: contains the validated and type-safe data
    console.log("🟢 [API] Validation passed, data is valid:", validatedData);

    // BLOCK: Upload profile picture to Vercel Blob (if provided)
    // Initialize variable to store profile picture URL
    let profilePictureUrl: string | undefined = undefined;

    // Check if a profile picture file was uploaded
    if (profilePictureFile && profilePictureFile.size > 0) {
      console.log("🔵 [API] Profile picture detected, uploading to Vercel Blob...");
      console.log("🔵 [API] File name:", profilePictureFile.name);
      console.log("🔵 [API] File size:", profilePictureFile.size, "bytes");
      console.log("🔵 [API] File type:", profilePictureFile.type);

      // Upload file to Vercel Blob storage
      const blob = await put(profilePictureFile.name, profilePictureFile, {
        access: "public", // Make the file publicly accessible via URL
      });
      // put(): uploads file to Vercel Blob and returns an object with url property
      // First argument: filename to store in blob storage
      // Second argument: the file data
      // Third argument: options (access level)

      profilePictureUrl = blob.url; // Store the URL for saving to database
      console.log("🟢 [API] Profile picture uploaded successfully:", profilePictureUrl);
    } else {
      console.log("🔵 [API] No profile picture provided, skipping upload");
    }

    // BLOCK: Database operation - Create tutor record
    // Create new tutor record in Neon database using Prisma
    console.log("🔵 [API] Attempting to create tutor in database...");
    console.log("🔵 [API] DATABASE_URL exists:", !!process.env.DATABASE_URL);
    console.log(
      "🔵 [API] DATABASE_URL starts with:",
      process.env.DATABASE_URL?.substring(0, 20)
    );

    const tutor = await prisma.tutor.create({
      // await: waits for database operation to complete
      // prisma.tutor: accesses Tutor model from schema
      // .create(): Prisma method to insert new record

      data: {
        // data property: contains fields to insert into database
        // Use validatedData instead of raw request body for security
        name: validatedData.name, // Validated name from Zod
        email: validatedData.email, // Validated email (guaranteed to be valid email format)
        subject: validatedData.subject, // Validated subject
        bio: validatedData.bio, // Validated bio (can be undefined since it's optional)
        profilePictureUrl: profilePictureUrl, // URL from Vercel Blob (undefined if no picture uploaded)
      },
    });
    // Returns created record with auto-generated id from database
    console.log("🟢 [API] Tutor created successfully:", tutor);

    // BLOCK: Success response
    // Return the created tutor as JSON with success status
    return NextResponse.json(tutor, { status: 200 });
    // NextResponse.json(): creates JSON response
    // tutor: JavaScript object to serialize to JSON
    // status: 200 means OK (success)
  } catch (error) {
    // catch block: executes if any error occurs in try block (database error, parsing error, etc.)

    // BLOCK: Error handling
    // Log detailed error information for debugging
    console.error("🔴 [API] Error occurred:");
    console.error("🔴 [API] Error name:", (error as Error).name);
    console.error("🔴 [API] Error message:", (error as Error).message);
    console.error("🔴 [API] Error stack:", (error as Error).stack);
    console.error("🔴 [API] Full error object:", error);

    // Return detailed error in development, generic in production
    const errorMessage =
      process.env.NODE_ENV === "development"
        ? `Error: ${(error as Error).message}`
        : "Internal server error";

    return new NextResponse(errorMessage, { status: 500 });
    // status: 500 means Internal Server Error (server-side error)
  }
}
// This route receives tutor data from form, validates it, saves to Neon database via Prisma, and returns saved record or error
