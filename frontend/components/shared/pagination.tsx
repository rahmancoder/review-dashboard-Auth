import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { PaginationMeta } from "@/lib/types";

/** Server-rendered pagination: page lives in the URL, so it is shareable, back-button friendly and fully server-side. */
export function Pagination({
  meta,
  basePath,
  params = {},
}: {
  meta: PaginationMeta;
  basePath: string;
  params?: Record<string, string | undefined>;
}) {
  const { page, totalPages, total, limit } = meta;
  const href = (p: number) => {
    const sp = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) if (v) sp.set(k, v);
    if (p > 1) sp.set("page", String(p));
    const qs = sp.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  };

  const from = total === 0 ? 0 : (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);
  const disabled = "pointer-events-none opacity-50";

  return (
    <nav aria-label="Pagination" className="flex items-center justify-between gap-3 pt-4 text-sm text-muted-foreground">
      <p>
        {from}-{to} of {total}
      </p>
      <div className="flex items-center gap-2">
        <Link
          href={href(page - 1)}
          aria-disabled={page <= 1}
          tabIndex={page <= 1 ? -1 : undefined}
          className={cn(buttonVariants({ variant: "outline", size: "sm" }), page <= 1 && disabled)}
        >
          <ChevronLeft /> Prev
        </Link>
        <span className="px-1">
          Page {page} / {totalPages}
        </span>
        <Link
          href={href(page + 1)}
          aria-disabled={page >= totalPages}
          tabIndex={page >= totalPages ? -1 : undefined}
          className={cn(buttonVariants({ variant: "outline", size: "sm" }), page >= totalPages && disabled)}
        >
          Next <ChevronRight />
        </Link>
      </div>
    </nav>
  );
}
