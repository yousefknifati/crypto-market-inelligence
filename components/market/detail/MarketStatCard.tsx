import type { ReactNode } from "react";

type MarketStatCardProps = {
  label: string;
  value: string;
  icon?: ReactNode;
  badge?: ReactNode;
  children?: ReactNode;
};

export default function MarketStatCard({ label, value, icon, badge, children }: MarketStatCardProps) {
  return (
    <article className="flex min-w-0 flex-col rounded-xl border border-sidebar-border bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2"><h3 className="flex items-center gap-1.5 text-[11px] tracking-wide text-sidebar-muted"><span className="text-sm text-primary">{icon}</span>{label}</h3>{badge}</div>
      <p className="my-4 break-words text-2xl font-bold tracking-tight text-slate-900">{value}</p>
      {children && <div className="mt-auto border-t border-sidebar-border pt-3 text-[11px] text-sidebar-muted">{children}</div>}
    </article>
  );
}
