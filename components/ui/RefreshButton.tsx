"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";

type RefreshButtonProps = {
  className?: string;
  size?: "sm" | "md";
};

export default function RefreshButton({
  className,
  size = "md",
}: RefreshButtonProps) {
  const router = useRouter();
  const [isRefreshing, startTransition] = useTransition();

  return (
    <Button
      className={className}
      disabled={isRefreshing}
      size={size}
      onClick={() => startTransition(() => router.refresh())}
    >
      {isRefreshing ? "Retrying…" : "Retry"}
    </Button>
  );
}
