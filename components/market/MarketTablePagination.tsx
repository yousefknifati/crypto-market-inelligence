import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import Button from "@/components/ui/Button";

type MarketTablePaginationProps = {
  currentPage: number;
  isFetching: boolean;
  onLoadMore: () => void;
  onPageChange: (page: number) => void;
  pageSize: number;
  totalItems: number;
  totalPages: number;
};

function getVisiblePages(currentPage: number, totalPages: number) {
  const pages = new Set([0, totalPages - 1, currentPage - 1, currentPage, currentPage + 1]);
  const sorted = [...pages].filter((page) => page >= 0 && page < totalPages).sort((a, b) => a - b);
  const visible: Array<number | "ellipsis"> = [];

  sorted.forEach((page, index) => {
    if (index > 0 && page - sorted[index - 1] > 1) visible.push("ellipsis");
    visible.push(page);
  });

  return visible;
}

export default function MarketTablePagination({
  currentPage,
  isFetching,
  onLoadMore,
  onPageChange,
  pageSize,
  totalItems,
  totalPages,
}: MarketTablePaginationProps) {
  const start = totalItems === 0 ? 0 : currentPage * pageSize + 1;
  const end = Math.min((currentPage + 1) * pageSize, totalItems);
  const visiblePages = getVisiblePages(currentPage, totalPages);

  return (
    <footer className="flex flex-col gap-3 border-t border-sidebar-border bg-slate-50/50 px-3 py-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-[11px] leading-[14px] font-medium tracking-[0.22px] text-sidebar-muted">
        Showing <strong className="font-semibold text-slate-900">{start}-{end}</strong> of{" "}
        <strong className="font-semibold text-slate-900">{totalItems}</strong> loaded assets
      </p>

      <nav aria-label="Market table pagination" className="flex items-center gap-1.5">
        <button
          type="button"
          disabled={currentPage === 0 || isFetching}
          onClick={() => onPageChange(currentPage - 1)}
          aria-label="Previous page"
          className="flex size-7 items-center justify-center rounded border border-sidebar-border bg-white text-slate-600 outline-none hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <FiChevronLeft aria-hidden="true" />
        </button>
        {visiblePages.map((item, index) => item === "ellipsis" ? (
          <span key={`ellipsis-${index}`} aria-hidden="true" className="px-1 text-[11px] text-slate-400">…</span>
        ) : (
          <button
            key={item}
            type="button"
            disabled={isFetching}
            onClick={() => onPageChange(item)}
            aria-label={`Page ${item + 1}`}
            aria-current={item === currentPage ? "page" : undefined}
            className={`flex size-7 items-center justify-center rounded text-[11px] font-medium outline-none focus-visible:ring-2 focus-visible:ring-primary/30 disabled:cursor-not-allowed ${
              item === currentPage
                ? "bg-primary font-bold text-white"
                : "border border-sidebar-border bg-white text-slate-600 hover:bg-slate-100"
            }`}
          >
            {item + 1}
          </button>
        ))}
        <button
          type="button"
          disabled={currentPage >= totalPages - 1 || isFetching}
          onClick={() => onPageChange(currentPage + 1)}
          aria-label="Next page"
          className="flex size-7 items-center justify-center rounded border border-sidebar-border bg-white text-slate-600 outline-none hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <FiChevronRight aria-hidden="true" />
        </button>
      </nav>

      <Button
        variant="outline"
        size="sm"
        disabled={pageSize >= totalItems || isFetching}
        onClick={onLoadMore}
      >
        Load More Assets
      </Button>
    </footer>
  );
}
