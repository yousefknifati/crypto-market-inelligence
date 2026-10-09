import type { HTMLAttributes } from "react";

type HeadingLevel = 1 | 2 | 3;
type HeadingSize = "lg" | "md" | "sm";

type HeadingProps = HTMLAttributes<HTMLHeadingElement> & {
  level?: HeadingLevel;
  size?: HeadingSize;
};

const headingTags = {
  1: "h1",
  2: "h2",
  3: "h3",
} as const;

const sizeClasses: Record<HeadingSize, string> = {
  lg: "text-2xl leading-8 tracking-[-0.6px]",
  md: "text-xl leading-7 tracking-[-0.4px]",
  sm: "text-base leading-6 tracking-[-0.2px]",
};

export default function Heading({
  children,
  className = "",
  level = 2,
  size = "md",
  ...props
}: HeadingProps) {
  const Tag = headingTags[level];

  return (
    <Tag
      className={`font-semibold text-slate-900 ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </Tag>
  );
}
