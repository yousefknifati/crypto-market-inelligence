import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "outline" | "ghost";
type ButtonSize = "sm" | "md";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  leadingIcon?: ReactNode;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-primary text-white shadow-[0_1px_1px_rgba(0,0,0,0.05)] hover:bg-indigo-700",
  outline: "border border-sidebar-border bg-white text-sidebar-muted hover:bg-sidebar-surface",
  ghost: "bg-transparent text-sidebar-muted hover:bg-sidebar-surface",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-xs",
  md: "h-9 px-3.5 text-[13px] leading-4",
};

export default function Button({
  children,
  className = "",
  leadingIcon,
  size = "md",
  type = "button",
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg font-semibold tracking-[0.13px] outline-none transition-colors motion-reduce:transition-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {leadingIcon}
      {children}
    </button>
  );
}
