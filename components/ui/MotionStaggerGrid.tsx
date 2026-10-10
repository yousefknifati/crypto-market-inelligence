"use client";

import { Children, type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

type MotionStaggerGridProps = {
  children: ReactNode;
  className?: string;
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.03,
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.22, ease: "easeOut" as const },
  },
};

export default function MotionStaggerGrid({
  children,
  className,
}: MotionStaggerGridProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={prefersReducedMotion ? false : "hidden"}
      animate="visible"
      variants={prefersReducedMotion ? undefined : containerVariants}
      className={className}
    >
      {Children.map(children, (child) => (
        <motion.div
          variants={prefersReducedMotion ? undefined : itemVariants}
          whileHover={prefersReducedMotion ? undefined : { y: -2 }}
          transition={{ duration: 0.16, ease: "easeOut" }}
          className="min-w-0 [&>*]:h-full"
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}
