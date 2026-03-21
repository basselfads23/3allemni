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
  phoneNumber: z.string().min(8, "Phone number must be at least 8 digits").optional().or(z.literal("")),
  bio: z.string().optional(),
});

export const userSettingsSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  phoneNumber: z.string().min(8, "Phone number must be at least 8 digits").optional().or(z.literal("")),
  role: z.enum(["PARENT", "TUTOR", "ADMIN"]),
});

export const educationSchema = z.object({
  degree: z.string().min(2, "Degree is required"),
  major: z.string().min(2, "Major is required"),
  university: z.string().min(2, "University is required"),
});

export type UserSettingsFormData = z.infer<typeof userSettingsSchema>;

export type EducationFormData = z.infer<typeof educationSchema>;

export type TutorFormData = z.infer<typeof tutorSchema>;

export type Education = {
  id: string;
  tutorId: string;
  degree: string;
  major: string;
  university: string;
  documentUrl: string | null;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
};

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
  phoneNumber: string | null;
  bio: string | null;
  profilePictureUrl: string | null;
  isVerified: boolean;
  verifiedDegree: string | null;
  educations?: Education[];
  createdAt: Date;
  updatedAt: Date;
};
