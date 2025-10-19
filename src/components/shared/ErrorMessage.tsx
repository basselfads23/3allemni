// src/components/shared/ErrorMessage.tsx
// BLOCK: Error Message Component
// Displays validation or error messages consistently

// BLOCK: Component props type definition
interface ErrorMessageProps {
  message: string;
  className?: string;
}

// BLOCK: ErrorMessage component
// Renders an error message with consistent styling
export default function ErrorMessage({
  message,
  className = "",
}: ErrorMessageProps) {
  if (!message) return null;

  return <p className={`form-error ${className}`}>{message}</p>;
}
