import Link from "next/link";
import { cn } from "@/lib/utils";

export const FILTERS = [
    { value: "PENDING", label: "Pending" },
    { value: "APPROVED", label: "Approved" },
    { value: "REJECTED", label: "Rejected" },
    { value: "ALL", label: "All" },
] as const;



export type FilterValue = (typeof FILTERS)[number]["value"];


/** Plain links: the filter lives in the URL and is applied by the API (server-side), never by slicing arrays in the browser. */
export function StatusFilter({ active, search }: { active: FilterValue; search?: string }) {

    return (
        <div role="tablist" aria-label="Filter submissions by status" className="inline-flex rounded-lg border bg-card p-1">
            {FILTERS.map((f) => {

                const sp = new URLSearchParams({ status: f.value });
                if (search) sp.set("search", search);

                const isActive = f.value === active;

                return (
                    <Link
                        key={f.value}
                        role="tab"
                        aria-selected={isActive}
                        href={`/mentor-dashboard?${sp}`}
                        className={cn(
                            "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                            isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent",
                        )}
                    >
                        {f.label}
                    </Link>
                );
            })}
        </div>
    );
}