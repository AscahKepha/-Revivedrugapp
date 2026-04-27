import * as React from "react";
import { cn } from "../../lib/utils";

// 1. Added more variants to fit your specific pages (War Room, Admin Hub)
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "danger" | "ghost" | "support";
  size?: "sm" | "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", children, ...props }, ref) => {
    
    const baseStyles = "inline-flex items-center justify-center rounded-xl font-bold transition-all active:scale-95 focus:outline-none disabled:opacity-50 disabled:pointer-events-none";

    // 2. Updated colors to match your Red/White branding
    const variants = {
      default: "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm",
      outline: "border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50", 
      danger: "bg-gray-900 text-white hover:bg-emerald-600",
      ghost: "text-gray-500 hover:bg-gray-100 hover:text-gray-900",
      support: "bg-emerald-500 text-white hover:bg-emerald-600",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-xs",
      md: "px-4 py-2 text-sm",
      lg: "px-6 py-3 text-base",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";