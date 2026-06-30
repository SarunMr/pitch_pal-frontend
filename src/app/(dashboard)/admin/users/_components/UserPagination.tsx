import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface UserPaginationProps {
  page: number;
  totalPages: number;
  basePath: string; // e.g. "/admin/users"
  searchParams: Record<string, string>;
}

function buildUrl(
  basePath: string,
  searchParams: Record<string, string>,
  targetPage: number,
) {
  const params = new URLSearchParams(searchParams);
  params.set("page", String(targetPage));
  return `${basePath}?${params.toString()}`;
}

export default function UserPagination({
  page,
  totalPages,
  basePath,
  searchParams,
}: UserPaginationProps) {
  if (totalPages <= 1) return null;

  const hasPrev = page > 1;
  const hasNext = page < totalPages;

  // Generate page numbers to show (always show first, last, current ±1)
  const pages: (number | "ellipsis")[] = [];
  const range = new Set<number>();
  [1, page - 1, page, page + 1, totalPages].forEach((p) => {
    if (p >= 1 && p <= totalPages) range.add(p);
  });
  const sorted = Array.from(range).sort((a, b) => a - b);
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) pages.push("ellipsis");
    pages.push(p);
  });

  return (
    <nav aria-label="Pagination" className="flex items-center gap-1">
      <Link
        href={hasPrev ? buildUrl(basePath, searchParams, page - 1) : "#"}
        aria-disabled={!hasPrev}
        className={cn(
          "flex items-center justify-center h-8 w-8 rounded-md border text-sm transition-colors",
          hasPrev
            ? "border-border hover:bg-accent hover:text-accent-foreground"
            : "border-border/50 text-muted-foreground pointer-events-none opacity-50",
        )}
      >
        <ChevronLeft size={14} />
      </Link>

      {pages.map((p, i) =>
        p === "ellipsis" ? (
          <span key={`ellipsis-${i}`} className="px-1 text-muted-foreground text-sm">
            …
          </span>
        ) : (
          <Link
            key={p}
            href={buildUrl(basePath, searchParams, p)}
            className={cn(
              "flex items-center justify-center h-8 w-8 rounded-md border text-sm font-medium transition-colors",
              p === page
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border hover:bg-accent hover:text-accent-foreground",
            )}
            aria-current={p === page ? "page" : undefined}
          >
            {p}
          </Link>
        ),
      )}

      <Link
        href={hasNext ? buildUrl(basePath, searchParams, page + 1) : "#"}
        aria-disabled={!hasNext}
        className={cn(
          "flex items-center justify-center h-8 w-8 rounded-md border text-sm transition-colors",
          hasNext
            ? "border-border hover:bg-accent hover:text-accent-foreground"
            : "border-border/50 text-muted-foreground pointer-events-none opacity-50",
        )}
      >
        <ChevronRight size={14} />
      </Link>
    </nav>
  );
}
