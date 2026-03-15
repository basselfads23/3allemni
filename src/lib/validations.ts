// src/lib/validations.ts
import { z } from "zod";

export const TeachingMode = z.enum(["IN_PERSON", "ONLINE", "BOTH"]);

export const tutorSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  subject: z.string().min(1, "Subject is required"),
  hourlyRate: z.number().positive("Hourly rate must be greater than 0"),
  teachingMode: TeachingMode,
  governorate: z.string().min(1, "Governorate is required"),
  district: z.string().min(1, "District is required"),
  city: z.string().min(1, "City is required"),
  
  // Optional fields
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  phoneNumber: z.string().min(8, "Phone number must be at least 8 digits").optional().or(z.literal("")),
  bio: z.string().optional(),
});

export type TutorFormData = z.infer<typeof tutorSchema>;

export type Tutor = {
  id: string;
  userId: string;
  name: string;
  subject: string;
  hourlyRate: number;
  teachingMode: "IN_PERSON" | "ONLINE" | "BOTH";
  governorate: string;
  district: string;
  city: string;
  email: string | null;
  phoneNumber: string | null;
  bio: string | null;
  profilePictureUrl: string | null;
  isVerified: boolean;
  verifiedDegree: string | null;
  createdAt: Date;
  updatedAt: Date;
};
