// src/services/tutorService.ts
// BLOCK: Tutor Service
// Business logic for tutor-related operations

import { prisma } from "@/lib/prisma";
import { TutorFormData } from "@/lib/validations";
import { type Tutor } from "@prisma/client";
import { serviceLogger } from "@/lib/logger";

// BLOCK: Get all tutors
// Fetches all tutors from the database
export async function getAllTutors(): Promise<Tutor[]> {
  try {
    const tutors = await prisma.tutor.findMany({
      orderBy: {
        id: "desc", // Most recent first
      },
    });
    return tutors as Tutor[];
  } catch (error) {
    serviceLogger.error("Error fetching tutors:", error);
    throw new Error("Failed to fetch tutors");
  }
}

// BLOCK: Get tutor by ID
// Fetches a single tutor by their ID
export async function getTutorById(id: string): Promise<Tutor | null> {
  try {
    const tutor = await prisma.tutor.findUnique({
      where: { id },
    });
    return tutor as Tutor | null;
  } catch (error) {
    serviceLogger.error(`Error fetching tutor with ID ${id}:`, error);
    throw new Error("Failed to fetch tutor");
  }
}

// BLOCK: Get tutor by user ID
// Fetches a single tutor by their associated user ID
export async function getTutorByUserId(userId: string): Promise<Tutor | null> {
  try {
    serviceLogger.info(`Fetching tutor for user ID: ${userId}`);
    const tutor = await prisma.tutor.findUnique({
      where: { userId },
    });
    
    if (!tutor) {
      serviceLogger.info(`No tutor profile found for user ID: ${userId}`);
      return null;
    }
    
    return tutor as Tutor;
  } catch (error) {
    serviceLogger.error(`Database error fetching tutor for user ID ${userId}:`, error);
    // Only throw if it's a real database error, not just "not found"
    throw new Error(`Database error fetching tutor: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

// BLOCK: Create new tutor
// Creates a new tutor record in the database
export async function createTutor(
  data: TutorFormData & { userId: string; profilePictureUrl?: string },
): Promise<Tutor> {
  try {
    const tutor = await prisma.tutor.create({
      data: {
        userId: data.userId,
        name: data.name,
        subject: data.subject,
        hourlyRate: data.hourlyRate,
        teachingMode: data.teachingMode,
        governorate: data.governorate,
        district: data.district,
        city: data.city,
        email: data.email || null,
        phoneNumber: data.phoneNumber || null,
        bio: data.bio || null,
        profilePictureUrl: data.profilePictureUrl || null,
      },
    });

    serviceLogger.success("Tutor created successfully:", tutor.id);
    return tutor as Tutor;
  } catch (error) {
    serviceLogger.error("Error creating tutor:", error);
    throw new Error("Failed to create tutor");
  }
}

// BLOCK: Update tutor
// Updates an existing tutor's information
export async function updateTutor(
  id: string,
  data: Partial<TutorFormData> & { profilePictureUrl?: string },
): Promise<Tutor> {
  try {
    const tutor = await prisma.tutor.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.subject && { subject: data.subject }),
        ...(data.hourlyRate !== undefined && { hourlyRate: data.hourlyRate }),
        ...(data.teachingMode !== undefined && { teachingMode: data.teachingMode }),
        ...(data.governorate !== undefined && { governorate: data.governorate }),
        ...(data.district !== undefined && { district: data.district }),
        ...(data.city !== undefined && { city: data.city }),
        ...(data.email !== undefined && { email: data.email || null }),
        ...(data.phoneNumber !== undefined && { phoneNumber: data.phoneNumber || null }),
        ...(data.bio !== undefined && { bio: data.bio || null }),
        ...(data.profilePictureUrl !== undefined && {
          profilePictureUrl: data.profilePictureUrl || null,
        }),
      },
    });

    serviceLogger.success("Tutor updated successfully:", tutor.id);
    return tutor as Tutor;
  } catch (error) {
    serviceLogger.error(`Error updating tutor with ID ${id}:`, error);
    throw new Error("Failed to update tutor");
  }
}

// BLOCK: Delete tutor
// Deletes a tutor from the database
export async function deleteTutor(id: string): Promise<void> {
  try {
    await prisma.tutor.delete({
      where: { id },
    });

    serviceLogger.success("Tutor deleted successfully:", id);
  } catch (error) {
    serviceLogger.error(`Error deleting tutor with ID ${id}:`, error);
    throw new Error("Failed to delete tutor");
  }
}

// BLOCK: Search tutors
// Search tutors by name, subject, bio, or location
export async function searchTutors(query: string): Promise<Tutor[]> {
  try {
    const tutors = await prisma.tutor.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { subject: { contains: query, mode: "insensitive" } },
          { bio: { contains: query, mode: "insensitive" } },
          { city: { contains: query, mode: "insensitive" } },
          { district: { contains: query, mode: "insensitive" } },
          { governorate: { contains: query, mode: "insensitive" } },
        ],
      },
      orderBy: {
        id: "desc",
      },
    });

    return tutors as Tutor[];
  } catch (error) {
    serviceLogger.error("Error searching tutors:", error);
    throw new Error("Failed to search tutors");
  }
}
