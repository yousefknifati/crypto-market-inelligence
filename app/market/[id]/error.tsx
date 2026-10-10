"use client";

import { FiRefreshCw } from "react-icons/fi";
import Button from "@/components/ui/Button";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div
      role="alert"
      className="m-4 rounded-xl border border-rose-200 bg-rose-50 p-6 text-rose-800 sm:m-6"
    >
      <h1 className="text-lg font-semibold">Asset details are unavailable</h1>
      <p className="mt-1 text-sm">
        The market data request could not be completed. Please try again.
      </p>
      <Button
        className="mt-4"
        size="sm"
        leadingIcon={<FiRefreshCw aria-hidden="true" />}
        onClick={reset}
      >
        Retry
      </Button>
    </div>
  );
}
