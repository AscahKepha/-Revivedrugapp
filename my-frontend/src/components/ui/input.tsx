import * as React from "react";
import { cn } from "../../lib/utils";

// 1. Added custom props to handle error states (common in medical/admin apps)
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  variant?: "default" | "support";
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, variant = "default", ...props }, ref) => {
    
    // 2. Base styles focusing on the rounded-xl design you're using everywhere
    const baseStyles = "flex h-11 w-full rounded-xl border bg-white px-4 py-2 text-sm shadow-sm transition-all file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50";

    // 3. Conditional colors based on the role or state
    const variantStyles = {
      default: error 
        ? "border-red-500 focus:ring-2 focus:ring-red-200" 
        : "border-gray-200 focus:border-red-600 focus:ring-2 focus:ring-red-100",
      support: error 
        ? "border-red-500 focus:ring-2 focus:ring-red-200" 
        : "border-gray-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100",
    };

    return (
      <input
        type={type}
        ref={ref}
        className={cn(baseStyles, variantStyles[variant], className)}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";