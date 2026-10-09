"use client";

import { memo, useEffect, useRef } from "react";
import {
  FiBell,
  FiChevronDown,
  FiCode,
  FiMenu,
  FiSearch,
  FiUser,
} from "react-icons/fi";
import type { BinanceConnectionStatus } from "@/type/binancePrices";

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
  const searchRef = useRef<HTMLInputElement>(null);
  const connected = status === "connected";

  useEffect(() => {
    const focusSearch = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", focusSearch);
    return () => window.removeEventListener("keydown", focusSearch);
  }, []);

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

      <label className="relative min-w-0 flex-1 sm:max-w-96">
        <span className="sr-only">
          Search markets, pairs, and smart contracts
        </span>
        <FiSearch
          aria-hidden="true"
          className="pointer-events-none absolute top-[11px] left-[14px] size-3.5 text-slate-400"
        />
        <input
          ref={searchRef}
          type="search"
          placeholder="Global search markets, pairs, smart contracts..."
          className="h-9 w-full rounded-lg border border-sidebar-border bg-sidebar-surface pr-12 pl-[37px] text-xs text-slate-800 outline-none placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/15"
        />
        <kbd className="pointer-events-none absolute top-[7px] right-2.5 hidden rounded border border-sidebar-border bg-white px-[7px] py-0.5 font-mono text-[10px] leading-[15px] text-sidebar-muted sm:block">
          ⌘K
        </kbd>
      </label>

      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <button
          type="button"
          className="hidden h-7 items-center gap-1.5 rounded-lg border border-sidebar-border bg-sidebar-surface px-2.5 text-[11px] leading-[14px] tracking-[0.44px] text-sidebar-muted outline-none hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-primary/30 lg:flex"
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
          aria-label="Notifications"
          className="relative flex h-9 w-[25px] items-start justify-center rounded-lg pt-1.5 outline-none hover:bg-sidebar-surface focus-visible:ring-2 focus-visible:ring-primary/30"
        >
          <FiBell aria-hidden="true" className="size-4 text-sidebar-muted" />
          <span
            aria-hidden="true"
            className="absolute top-1 right-1 size-2 rounded-full bg-primary"
          />
        </button>

        <button
          type="button"
          aria-label="Developer tools"
          className="hidden h-7 w-[30px] items-center justify-center rounded-lg outline-none hover:bg-sidebar-surface focus-visible:ring-2 focus-visible:ring-primary/30 sm:flex"
        >
          <FiCode aria-hidden="true" className="size-[19px] text-sidebar-muted" />
        </button>

        <button
          type="button"
          aria-label="Open profile menu"
          className="flex h-9 items-center gap-2 rounded-lg px-1 outline-none hover:bg-sidebar-surface focus-visible:ring-2 focus-visible:ring-primary/30"
        >
          <span className="flex size-7 items-center justify-center rounded-full border border-sidebar-active-border bg-sidebar-active text-[11px] leading-[14px] font-bold tracking-[0.44px] text-primary">
            IN
          </span>
          <FiUser aria-hidden="true" className="hidden size-[15px] text-sidebar-muted sm:block" />
        </button>
      </div>
    </div>
  );
}

export default memo(HeaderToolbar);
