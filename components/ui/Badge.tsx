import type { HTMLAttributes } from "react";

type BadgeTone = "success" | "neutral" | "warning" | "danger";
type BadgeShape = "pill" | "rounded";
type BadgeSize = "xs" | "sm" | "md";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  dot?: boolean;
  shape?: BadgeShape;
  size?: BadgeSize;
  tone?: BadgeTone;
};

const toneClasses: Record<BadgeTone, string> = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-700",
  neutral: "border-sidebar-border bg-white text-sidebar-muted",
  warning: "border-amber-200 bg-amber-50 text-amber-700",
  danger: "border-rose-200 bg-rose-50 text-rose-700",
};

const dotClasses: Record<BadgeTone, string> = {
  success: "bg-emerald-500",
  neutral: "bg-slate-400",
  warning: "bg-amber-500",
  danger: "bg-rose-500",
};

const shapeClasses: Record<BadgeShape, string> = {
  pill: "rounded-full",
  rounded: "rounded-lg",
};

const sizeClasses: Record<BadgeSize, string> = {
  xs: "min-h-5 gap-1 px-2 py-0.5 tracking-[0.44px]",
  sm: "min-h-6 gap-2 px-[11px] py-1 tracking-[0.44px]",
  md: "min-h-7 gap-2 px-[13px] py-1.5 tracking-[0.22px]",
};

export default function Badge({
  children,
  className = "",
  dot = false,
  shape = "pill",
  size = "sm",
  tone = "neutral",
  ...props
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center border text-[11px] leading-[14px] font-medium ${toneClasses[tone]} ${shapeClasses[shape]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {dot && (
        <span aria-hidden="true" className="relative flex size-2 shrink-0">
          <span className={`absolute inset-0 rounded-full opacity-40 motion-safe:animate-ping ${dotClasses[tone]}`} />
          <span className={`relative size-2 rounded-full ${dotClasses[tone]}`} />
        </span>
      )}
      {children}
    </span>
  );
}
