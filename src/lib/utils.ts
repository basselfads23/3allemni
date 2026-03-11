// 🛠️ Utility Functions
// Reusable helper functions used throughout the application

// 💰 Format price for display
// Converts a number to a formatted currency string
export function formatPrice(price: number | null | undefined): string {
  if (price === null || price === undefined || isNaN(price)) {
    return "Price not specified";
  }
  if (price < 0) {
    return "Invalid price";
  }
  return `$${price.toFixed(2)}/hour`;
}

// 📍 Format location for display
// Handles null/undefined locations gracefully
export function formatLocation(location: string | null | undefined): string {
  if (!location || location.trim() === "") {
    return "Location not specified";
  }
  return location;
}

// 📧 Validate email format
// Simple email validation (additional to Zod validation)
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim()) && !email.includes("..");
}

// 🖼️ Validate file type
// Check if uploaded file is an allowed image type
export function isValidImageType(file: File): boolean {
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif",
  ];
  return allowedTypes.includes(file.type.toLowerCase());
}

// 📦 Validate file size
// Check if file size is within limit (in MB)
export function isValidFileSize(file: File, maxSizeMB: number): boolean {
  // Validate maxSizeMB is a valid positive number
  if (typeof maxSizeMB !== "number" || isNaN(maxSizeMB)) {
    throw new Error("maxSizeMB must be a valid number");
  }

  if (maxSizeMB <= 0 || !isFinite(maxSizeMB)) {
    throw new Error("maxSizeMB must be a positive finite number");
  }
  const maxSizeBytes = maxSizeMB * 1024 ** 2;
  return file.size <= maxSizeBytes;
}

// 🎨 Get initials from name
// Extract initials for avatar placeholder (e.g., "John Doe" -> "JD")
export function getInitials(name: string): string {
  if (!name?.trim()) return "?";

  return name
    .trim()
    .split(/\s+/) // Split on one or more spaces
    .map((word) => word[0] || "") // Safely handle potential empty words
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// 🔤 Truncate text
// Shorten text to specified length with ellipsis
export function truncate(text: string, maxLength: number): string {
  if (maxLength < 0) {
    throw new Error("maxLength must be non-negative");
  }
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

// 🔍 Filter tutors by search query
// Generic search function for tutor filtering
export function searchTutors<
  T extends { name: string; subject: string; bio?: string | null }
>(tutors: T[], query: string): T[] {
  if (!query.trim()) return tutors;

  const lowerQuery = query.toLowerCase();
  return tutors.filter((tutor) => {
    const searchableFields = [
      tutor.name,
      tutor.subject,
      tutor.bio, // Handles null/undefined gracefully
    ];

    return searchableFields.some(
      (field) => field && field.toLowerCase().includes(lowerQuery)
    );
  });
}

// 📊 Get unique values from array
// Extract unique values from an array of objects by key
export function getUniqueValues<T, K extends keyof T>(
  items: T[],
  key: K
): Array<T[K]> {
  const values = items
    .map((item) => item[key])
    .filter((value) => value != null);
  return Array.from(new Set(values));
}

// ⏱️ Format date
// Format date to readable string
export function formatDate(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  if (isNaN(dateObj.getTime())) {
    return "Invalid date";
  }
  return dateObj.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// 🎯 Class name utility
// Combine class names conditionally (simple alternative to clsx)
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}
