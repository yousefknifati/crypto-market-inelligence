import { useEffect, type RefObject } from "react";

type AccessibleNavigationDrawerOptions = {
  contentRef: RefObject<HTMLElement | null>;
  drawerId: string;
  isOpen: boolean;
  onClose: () => void;
};

const focusableSelector = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

export function useAccessibleNavigationDrawer({
  contentRef,
  drawerId,
  isOpen,
  onClose,
}: AccessibleNavigationDrawerOptions) {
  useEffect(() => {
    if (!isOpen) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const drawer = document.getElementById(drawerId);
    const pageContent = contentRef.current;
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";
    pageContent?.setAttribute("inert", "");

    const focusDrawer = window.requestAnimationFrame(() => {
      drawer?.querySelector<HTMLElement>("[data-drawer-close]")?.focus();
    });

    const handleKeyboard = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key !== "Tab" || !drawer) return;

      const focusableElements = [
        ...drawer.querySelectorAll<HTMLElement>(focusableSelector),
      ];
      if (!focusableElements.length) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements.at(-1)!;
      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    window.addEventListener("keydown", handleKeyboard);
    return () => {
      window.cancelAnimationFrame(focusDrawer);
      document.body.style.overflow = previousOverflow;
      pageContent?.removeAttribute("inert");
      window.removeEventListener("keydown", handleKeyboard);
      previouslyFocused?.focus();
    };
  }, [contentRef, drawerId, isOpen, onClose]);
}
