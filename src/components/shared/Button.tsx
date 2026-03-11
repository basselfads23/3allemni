// src/components/shared/Button.tsx
// BLOCK: Reusable Button Component
// Provides consistent button styling throughout the application

import { cn } from "@/lib/utils";

// BLOCK: Component props type definition
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

// BLOCK: Button component
// Renders a button with consistent styling based on variant and size
export default function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  const baseClasses = "button";
  const variantClasses = {
    primary: "button-primary",
    secondary: "button-secondary",
    outline: "button-outline",
  };
  const sizeClasses = {
    sm: "button-sm",
    md: "button-md",
    lg: "button-lg",
  };

  return (
    <button
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}>
      {children}
    </button>
  );
}
