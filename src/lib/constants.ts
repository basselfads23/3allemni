// 📦 Application Constants
// Centralized constants to avoid hardcoding values throughout the application

// 🎓 Subject Options
// Available subjects for tutoring
export const SUBJECTS = [
  "Physics",
  "Chemistry",
  "Biology",
  "Maths",
  "English",
  "French",
  "Arabic",
  "Social Sciences",
] as const;

export type Subject = (typeof SUBJECTS)[number];

// 💰 Price Ranges
// For filtering tutors by hourly rate
export const PRICE_RANGES = [
  { label: "All Prices", min: 0, max: Infinity },
  { label: "$0 - $20", min: 0, max: 20 },
  { label: "$20 - $50", min: 20, max: 50 },
  { label: "$50 - $100", min: 50, max: 100 },
  { label: "$100+", min: 100, max: Infinity },
] as const;

// 📏 Validation Constants
export const VALIDATION = {
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 100,
  BIO_MAX_LENGTH: 1000,
  PRICE_MIN: 0,
  PRICE_MAX: 1000,
  IMAGE_MAX_SIZE_MB: 5,
  IMAGE_ALLOWED_TYPES: ["image/jpeg", "image/png", "image/webp", "image/gif"],
} as const;

// 🎨 Application Metadata
export const APP_CONFIG = {
  name: "3allemni",
  tagline: "Learn with trust",
  description: "Connect with trusted tutors for personalized learning",
  supportEmail: "support@3allemni.com",
} as const;

// 🔤 Default Values
export const DEFAULTS = {
  PROFILE_PICTURE_SIZE: 56, // pixels for thumbnail
  PROFILE_PICTURE_LARGE_SIZE: 144, // pixels for profile page
  ITEMS_PER_PAGE: 20,
} as const;
