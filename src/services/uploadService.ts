// src/services/uploadService.ts
// BLOCK: Upload Service
// Handles file uploads to Vercel Blob storage

import { put } from "@vercel/blob";
import { VALIDATION } from "@/lib/constants";
import { serviceLogger } from "@/lib/logger";

// BLOCK: Upload profile picture
// Uploads an image file to Vercel Blob and returns the public URL
export async function uploadProfilePicture(file: File): Promise<string> {
  try {
    // Validate file type
    const allowedTypes = VALIDATION.IMAGE_ALLOWED_TYPES as readonly string[];
    if (!allowedTypes.includes(file.type)) {
      throw new Error(
        `Invalid file type. Allowed types: ${VALIDATION.IMAGE_ALLOWED_TYPES.join(", ")}`
      );
    }

    // Validate file size (convert MB to bytes)
    const maxSizeBytes = VALIDATION.IMAGE_MAX_SIZE_MB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      throw new Error(
        `File size exceeds ${VALIDATION.IMAGE_MAX_SIZE_MB}MB limit`
      );
    }

    // Generate unique filename to avoid collisions
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const extension = file.name.split(".").pop();
    const uniqueFilename = `profile-${timestamp}-${randomString}.${extension}`;

    serviceLogger.info("Uploading file to Vercel Blob:", uniqueFilename);

    // Upload to Vercel Blob
    const blob = await put(uniqueFilename, file, {
      access: "public",
    });

    serviceLogger.success("File uploaded successfully:", blob.url);
    return blob.url;
  } catch (error) {
    serviceLogger.error("Error uploading file:", error);
    throw new Error("Failed to upload file");
  }
}

// BLOCK: Upload document
// Uploads a document (PDF or Image) to Vercel Blob and returns the URL
export async function uploadDocument(file: File): Promise<string> {
  try {
    const allowedTypes = ["application/pdf", "image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      throw new Error("Invalid file type. Please upload a PDF or an Image.");
    }

    const maxSizeMB = 5;
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      throw new Error(`File size exceeds ${maxSizeMB}MB limit`);
    }

    const timestamp = Date.now();
    const extension = file.name.split(".").pop();
    const uniqueFilename = `doc-${timestamp}-${Math.random().toString(36).substring(7)}.${extension}`;

    const blob = await put(uniqueFilename, file, { access: "public" });
    return blob.url;
  } catch (error) {
    serviceLogger.error("Error uploading document:", error);
    throw error;
  }
}

// BLOCK: Delete file from Vercel Blob
// Deletes a file from Vercel Blob storage (for future use)
export async function deleteFile(url: string): Promise<void> {
  try {
    // Note: Vercel Blob doesn't have a delete API yet
    // This is a placeholder for future implementation
    serviceLogger.info("File deletion requested:", url);
    // When Vercel adds delete API, implement here
  } catch (error) {
    serviceLogger.error("Error deleting file:", error);
    throw new Error("Failed to delete file");
  }
}
