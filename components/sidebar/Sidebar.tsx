"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiActivity,
  FiBarChart2,
  FiBookOpen,
  FiHeadphones,
  FiSettings,
  FiStar,
  FiTrendingUp,
} from "react-icons/fi";
import ConnectionStatus from "@/components/sidebar/ConnectionStatus";
import type { SidebarItem } from "@/type/sidebar";

const navigation: SidebarItem[] = [
  { label: "Market Overview", icon: FiBarChart2, href: "/" },
  { label: "Watchlist", icon: FiStar, href: "/watchlist" },
  { label: "Order Depth", icon: FiTrendingUp },
  { label: "Analytics", icon: FiActivity },
  { label: "Settings", icon: FiSettings },
];

const support: SidebarItem[] = [
  { label: "Documentation", icon: FiBookOpen },
  { label: "Terminal Support", icon: FiHeadphones },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      aria-label="Terminal sidebar"
      className="sticky top-0 flex h-dvh w-15 shrink-0 flex-col overflow-y-auto border-r border-sidebar-border bg-white px-2 py-4 font-sans text-sidebar-foreground sm:w-64 sm:px-4"
    >
      <Link
        href="/"
        aria-label="Crypto Market Intelligence home"
        className="flex h-11 shrink-0 items-center justify-center gap-2 rounded-sm px-1 pt-1 text-primary outline-offset-4 focus-visible:outline-2 focus-visible:outline-primary sm:justify-start"
      >
        <FiBarChart2 aria-hidden="true" className="size-5 shrink-0" />
        <span className="hidden text-xs leading-tight font-bold tracking-wide sm:block">
          CRYPTO MARKET
          <span className="block text-[10px] font-medium">INTELLIGENCE</span>
        </span>
      </Link>

      <p className="mt-6 hidden px-2 pt-[7px] pb-[3px] text-[11px] leading-[14px] font-medium tracking-[0.22px] text-sidebar-muted sm:block">
        Terminal v2.4 • Institutional
      </p>

      <nav aria-label="Main navigation" className="mt-6">
        <ul className="space-y-1.5">
          {navigation.map(({ label, icon: Icon, href }) => {
            const active = href === "/"
              ? pathname === "/" || pathname.startsWith("/market/")
              : Boolean(href && (pathname === href || pathname.startsWith(`${href}/`)));
            const className = `flex min-h-10 w-full items-center justify-center gap-3 rounded-lg border px-2 py-[7px] text-[13px] leading-4 font-semibold tracking-[0.13px] transition-colors motion-reduce:transition-none sm:min-h-8 sm:justify-start sm:px-[11px] ${
              active
                ? "border-primary/20 bg-sidebar-active text-primary sm:min-h-[34px] sm:px-3 sm:py-2"
                : "border-transparent text-slate-600"
            }`;
            const content = (
              <>
                <Icon aria-hidden="true" className="size-[15px] shrink-0" />
                <span className="sr-only sm:not-sr-only">{label}</span>
              </>
            );

            return (
              <li key={label}>
                {href ? (
                  <Link
                    href={href}
                    title={label}
                    aria-current={active ? "page" : undefined}
                    className={`${className} hover:bg-sidebar-active focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary`}
                  >
                    {content}
                  </Link>
                ) : (
                  <button type="button" disabled title={`${label} — coming soon`} className={`${className} cursor-not-allowed`}>
                    {content}
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="mt-auto pt-6">
        <div className="mb-4 space-y-1 border-t border-sidebar-border pt-4">
          {support.map(({ label, icon: Icon }) => (
            <button
              key={label}
              type="button"
              disabled
              title={`${label} — coming soon`}
              className="flex min-h-10 w-full cursor-not-allowed items-center justify-center gap-3 rounded-lg px-2 py-1.5 text-[11px] leading-[14px] font-semibold tracking-[0.44px] text-slate-600 sm:min-h-[26px] sm:justify-start"
            >
              <Icon aria-hidden="true" className="size-3.5 shrink-0" />
              <span className="sr-only sm:not-sr-only">{label}</span>
            </button>
          ))}
        </div>
        <div className="[&>[role=status]]:gap-2 [&>[role=status]]:px-3 [&>[role=status]]:py-2 [&>[role=status]]:text-[11px] [&>[role=status]]:leading-[14px] [&>[role=status]]:font-medium [&>[role=status]]:tracking-[0.22px] [&>[role=status]>span:first-child]:size-2 [&>[role=status]>span:last-child]:font-semibold">
          <ConnectionStatus />
        </div>
      </div>
    </aside>
  );
}
