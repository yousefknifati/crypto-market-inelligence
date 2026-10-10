"use client";

import { useCallback, useRef, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import MarketHeader from "@/components/header/MarketHeader";
import Sidebar from "@/components/sidebar/Sidebar";
import { useAccessibleNavigationDrawer } from "@/hooks/useAccessibleNavigationDrawer";

type DashboardShellProps = {
  children: ReactNode;
};

export default function DashboardShell({ children }: DashboardShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();
  const pageContentRef = useRef<HTMLDivElement>(null);
  const closeSidebar = useCallback(() => setIsSidebarOpen(false), []);
  const openSidebar = useCallback(() => setIsSidebarOpen(true), []);

  useAccessibleNavigationDrawer({
    contentRef: pageContentRef,
    drawerId: "terminal-sidebar",
    isOpen: isSidebarOpen,
    onClose: closeSidebar,
  });

  return (
    <div className="flex min-h-dvh w-full min-w-0 max-w-none bg-slate-50">
      <a
        href="#main-content"
        className="fixed top-3 left-3 z-[100] -translate-y-20 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-primary shadow-lg focus:translate-y-0"
      >
        Skip to main content
      </a>
      <button
        type="button"
        aria-label="Close navigation menu"
        onClick={closeSidebar}
        className={`fixed inset-0 z-40 bg-slate-950/35 backdrop-blur-[1px] transition-opacity duration-200 motion-reduce:transition-none xl:hidden ${
          isSidebarOpen
            ? "visible opacity-100"
            : "invisible pointer-events-none opacity-0"
        }`}
      />

      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      <div ref={pageContentRef} className="flex w-0 min-w-0 flex-1 flex-col">
        <MarketHeader
          isSidebarOpen={isSidebarOpen}
          onMenuClick={openSidebar}
        />
        <main id="main-content" tabIndex={-1} className="min-w-0 flex-1">
          <AnimatePresence mode="wait" initial={!prefersReducedMotion}>
            <motion.div
              key={pathname}
              initial={
                prefersReducedMotion ? false : { opacity: 0, y: 8 }
              }
              animate={{ opacity: 1, y: 0 }}
              exit={
                prefersReducedMotion ? undefined : { opacity: 0, y: -4 }
              }
              transition={{
                duration: prefersReducedMotion ? 0 : 0.18,
                ease: "easeOut",
              }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
