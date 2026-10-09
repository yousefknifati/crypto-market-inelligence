"use client";

import dynamic from "next/dynamic";

const Toaster = dynamic(
  () => import("react-hot-toast").then((module) => module.Toaster),
  { ssr: false, loading: () => null },
);

export default function AppToaster() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: "var(--background)",
          color: "var(--foreground)",
          maxWidth: "min(420px, calc(100vw - 32px))",
          whiteSpace: "pre-wrap",
          overflowWrap: "anywhere",
          textAlign: "start",
        },
      }}
    />
  );
}
