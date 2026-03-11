// src/components/shared/LoadingSpinner.tsx
// BLOCK: Loading Spinner Component
// Displays a loading indicator for async operations

// BLOCK: Component props type definition
interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  message?: string;
}

// BLOCK: LoadingSpinner component
// Renders a loading spinner with optional message
export default function LoadingSpinner({
  size = "md",
  message,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "spinner-sm",
    md: "spinner-md",
    lg: "spinner-lg",
  };

  return (
    <div className="loading-container">
      <div className={`spinner ${sizeClasses[size]}`}></div>
      {message && <p className="loading-message">{message}</p>}
    </div>
  );
}
