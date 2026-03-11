// src/lib/validations.ts
// This file contains Zod validation schemas for form data validation
// Schemas define the "shape" and rules for data we expect

// Import the 'z' object from Zod library
// 'z' gives us methods to define validation rules (z.string(), z.email(), etc.)
import { z } from "zod";

// BLOCK: Tutor Schema Definition
// Define validation schema for tutor registration form
// This creates a "contract" that data must follow
// Note: Email is no longer here - it's in the User model (from OAuth)
export const tutorSchema = z.object({
  // z.object() - creates a schema for an object with specific properties
  // Everything inside the curly braces defines what properties the object should have

  // Validate 'name' field
  name: z
    .string() // Must be a string (text)
    .min(2, "Name must be at least 2 characters") // Minimum 2 characters, custom error message if fails
    .max(100, "Name must be less than 100 characters"), // Maximum 100 characters

  // Validate 'subject' field
  subject: z
    .string() // Must be a string
    .min(1, "Subject is required"), // Must not be empty (at least 1 character)

  // Validate 'bio' field (optional)
  bio: z
    .string() // Must be a string
    .optional(), // This field is optional (can be undefined or empty)
  // .optional() means the field can be missing or undefined

  // Validate 'price' field (optional)
  price: z
    .number() // Must be a number
    .positive("Price must be greater than 0") // Must be positive
    .optional(), // This field is optional (can be undefined)

  // Validate 'location' field (optional)
  location: z
    .string() // Must be a string
    .optional(), // This field is optional (can be undefined)
});

// BLOCK: TypeScript Type Inference
// Extract TypeScript type from the Zod schema
// This gives us type safety in our code
export type TutorFormData = z.infer<typeof tutorSchema>;
// z.infer<typeof tutorSchema> - automatically creates a TypeScript type from our schema
// Result: TutorFormData = { name: string; subject: string; bio?: string; price?: number; location?: string }
// The ? means the field is optional
// Now we can use this type throughout our app for type checking

// BLOCK: Database Tutor Type
// Type for tutors fetched from database (includes auto-generated fields)
export type Tutor = {
  id: string; // Auto-generated ID (cuid)
  userId: string; // Foreign key to User
  name: string;
  subject: string;
  bio: string | null;
  profilePictureUrl: string | null;
  price: number | null;
  location: string | null;
  createdAt: Date;
  updatedAt: Date;
};
// & is the "intersection" operator - combines two types
// Takes all properties from TutorFormData AND adds the database fields
// Use this type when working with tutors from the database
