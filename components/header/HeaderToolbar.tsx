"use client";

import { memo, useCallback, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  FiBell,
  FiChevronDown,
  FiCode,
  FiMenu,
  FiSearch,
  FiUser,
} from "react-icons/fi";
import type { BinanceConnectionStatus } from "@/types/binancePrices";

type HeaderToolbarProps = {
  isSidebarOpen: boolean;
  status: BinanceConnectionStatus;
  latency: number | null;
  onMenuClick: () => void;
};

function HeaderToolbar({
  isSidebarOpen,
  status,
  latency,
  onMenuClick,
}: HeaderToolbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const connected = status === "connected";
  const openMarketSearch = useCallback(() => {
    if (pathname === "/") {
      document.getElementById("market-search")?.focus();
      return;
    }

    router.push("/#market-search");
  }, [pathname, router]);

  useEffect(() => {
    const focusSearch = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        openMarketSearch();
      }
    };
    window.addEventListener("keydown", focusSearch);
    return () => window.removeEventListener("keydown", focusSearch);
  }, [openMarketSearch]);

  return (
    <div className="flex h-14 shrink-0 items-center justify-between gap-2 border-b border-sidebar-border bg-white px-3 shadow-[0_1px_1px_rgba(0,0,0,0.03)] sm:gap-4 sm:px-6">
      <button
        type="button"
        aria-label="Open navigation menu"
        aria-controls="terminal-sidebar"
        aria-expanded={isSidebarOpen}
        onClick={onMenuClick}
        className="flex size-9 shrink-0 items-center justify-center rounded-lg text-sidebar-muted outline-none hover:bg-sidebar-surface focus-visible:ring-2 focus-visible:ring-primary/30 xl:hidden"
      >
        <FiMenu aria-hidden="true" className="size-5" />
      </button>

      <button
        type="button"
        onClick={openMarketSearch}
        aria-label="Go to asset search"
        className="relative h-9 min-w-0 flex-1 rounded-lg border border-sidebar-border bg-sidebar-surface pr-12 pl-[37px] text-left text-xs text-slate-400 outline-none hover:border-slate-300 hover:bg-white focus-visible:ring-2 focus-visible:ring-primary/30 sm:max-w-96"
      >
        <FiSearch
          aria-hidden="true"
          className="pointer-events-none absolute top-[11px] left-[14px] size-3.5 text-slate-400"
        />
        <span className="block truncate">
          Search assets by name or symbol...
        </span>
        <kbd className="pointer-events-none absolute top-[7px] right-2.5 hidden rounded border border-sidebar-border bg-white px-[7px] py-0.5 font-mono text-[10px] leading-[15px] text-sidebar-muted sm:block">
          ⌘K
        </kbd>
      </button>

      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <button
          type="button"
          disabled
          title="Currency selection is not available yet"
          className="hidden h-7 cursor-not-allowed items-center gap-1.5 rounded-lg border border-sidebar-border bg-sidebar-surface px-2.5 text-[11px] leading-[14px] tracking-[0.44px] text-sidebar-muted opacity-60 outline-none lg:flex"
        >
          <span className="font-semibold">Currency:</span>
          <span className="font-bold text-slate-900">USD</span>
          <FiChevronDown aria-hidden="true" className="size-3" />
        </button>

        <div
          role="status"
          title={
            connected && latency !== null
              ? `WebSocket latency ${latency} milliseconds`
              : `WebSocket ${status}`
          }
          className="hidden h-7 items-center gap-1.5 rounded-lg border border-sidebar-border bg-sidebar-surface px-2.5 text-[11px] leading-[14px] tracking-[0.44px] text-sidebar-muted md:flex"
        >
          <span
            aria-hidden="true"
            className={`size-2 rounded-full ${connected ? "bg-emerald-500" : "bg-amber-500"}`}
          />
          <span>Latency:</span>
          <span className="sr-only">WebSocket {status}.</span>
          <span className="font-semibold text-slate-800">
            {latency === null ? "—" : `${latency}ms`}
          </span>
        </div>

        <div
          aria-hidden="true"
          className="mx-1 hidden h-5 w-px bg-sidebar-border sm:block"
        />

        <button
          type="button"
          disabled
          aria-label="Notifications"
          title="Notifications are not available yet"
          className="relative flex h-9 w-[25px] cursor-not-allowed items-start justify-center rounded-lg pt-1.5 opacity-60 outline-none"
        >
          <FiBell aria-hidden="true" className="size-4 text-sidebar-muted" />
          <span
            aria-hidden="true"
            className="absolute top-1 right-1 size-2 rounded-full bg-primary"
          />
        </button>

        <button
          type="button"
          disabled
          aria-label="Developer tools"
          title="Developer tools are not available yet"
          className="hidden h-7 w-[30px] cursor-not-allowed items-center justify-center rounded-lg opacity-60 outline-none sm:flex"
        >
          <FiCode
            aria-hidden="true"
            className="size-[19px] text-sidebar-muted"
          />
        </button>

        <button
          type="button"
          disabled
          aria-label="Open profile menu"
          title="Profile controls are not available yet"
          className="flex h-9 cursor-not-allowed items-center gap-2 rounded-lg px-1 opacity-60 outline-none"
        >
          <span className="flex size-7 items-center justify-center rounded-full border border-sidebar-active-border bg-sidebar-active text-[11px] leading-[14px] font-bold tracking-[0.44px] text-primary">
            IN
          </span>
          <FiUser
            aria-hidden="true"
            className="hidden size-[15px] text-sidebar-muted sm:block"
          />
        </button>
      </div>
    </div>
  );
}

export default memo(HeaderToolbar);
