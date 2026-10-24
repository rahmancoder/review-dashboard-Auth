import { redirect } from "next/navigation";
import { ExternalLink, GitBranch } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { Pagination } from "@/components/shared/pagination";
import { StatusBadge } from "@/components/shared/status-badge";

import { Skeleton } from "@/components/ui/skeleton";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { ApiError } from "@/lib/api-error";

import { backendFetch } from "@/lib/backendFetch";

import { formatDate } from "@/lib/utils";
import type { Submission } from "@/lib/types";

import { InlineError } from "./InlineError";

import { ReviewActions } from "./ReviewActions";

import type { FilterValue } from "./StatusFilter";

const PAGE_SIZE = 10;

/**
 * Data fetching (Topic 2C): fetched on the server, per request (`cache: "no-store"` in backendFetch), so the table is always fresh.
 *  - filter / page / search are sent to the API as query params => the DATABASE does the filtering + pagination
 *  - loading : the parent wraps this in <Suspense key=...> with <TableSkeleton/>
 *  - mutation: reviewSubmissionAction() calls revalidatePath("/mentor-dashboard"), Next re-renders this component with new data
 *  - errors  : expected API failures render <InlineError/>; anything unexpected bubbles to (dashboardGroup)/error.tsx
 */
export async function ReviewTable({ status, page, search }: { status: FilterValue; page: number; search?: string }) {
    let items: Submission[];
    let meta;
    try {
        const res = await backendFetch<Submission[]>("/reviews/submissions", {
            query: { status: status === "ALL" ? undefined : status, page, limit: PAGE_SIZE, search },
        });
        items = res.data;
        meta = res.meta;
    } catch (err) {
        if (err instanceof ApiError && err.status === 401) redirect("/login");
        const message = err instanceof ApiError ? err.message : "Couldn't load submissions.";
        return <InlineError message={message} retryHref={`/mentor-dashboard?status=${status}`} />;
    }

    if (items.length === 0) {
        return (
            <EmptyState
                title={status === "PENDING" && !search ? "All caught up 🎉" : "No submissions found"}
                description={search ? `Nothing matches “${search}” in this filter.` : "There are no submissions in this view yet."}
            />
        );
    }

    return (
        <div className="rounded-xl border bg-card">
            <Table>
                <TableHeader>
                    <TableRow className="hover:bg-transparent">
                        <TableHead>Project</TableHead>
                        <TableHead>Student</TableHead>
                        <TableHead>Submitted</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {items.map((s) => {
                        const feedback = s.feedbacks[0];
                        return (
                            <TableRow key={s.id}>
                                <TableCell className="max-w-sm">
                                    <p className="font-medium">{s.projectName}</p>
                                    <p className="line-clamp-2 text-xs text-muted-foreground" title={s.description}>
                                        {s.description}
                                    </p>
                                    <div className="mt-1.5 flex gap-3 text-xs">
                                        <a href={s.repoUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline">
                                            <GitBranch className="size-3.5" /> Repo
                                        </a>
                                        <a href={s.liveUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline">
                                            <ExternalLink className="size-3.5" /> Live
                                        </a>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <p className="text-sm">{s.student?.name}</p>
                                    <p className="text-xs text-muted-foreground">{s.student?.email}</p>
                                </TableCell>
                                <TableCell className="whitespace-nowrap text-muted-foreground">{formatDate(s.createdAt)}</TableCell>
                                <TableCell>
                                    <StatusBadge status={s.status} />
                                </TableCell>
                                <TableCell className="text-right">
                                    {s.status === "PENDING" ? (
                                        <div className="flex justify-end">
                                            <ReviewActions id={s.id} projectName={s.projectName} />
                                        </div>
                                    ) : (
                                        <p className="ml-auto max-w-48 text-xs text-muted-foreground">
                                            {feedback ? `${feedback.mentor.name}${feedback.comment ? `: ${feedback.comment}` : ""}` : "-"}
                                        </p>
                                    )}
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
            {meta && (
                <div className="px-4 pb-3">
                    <Pagination meta={meta} basePath="/mentor-dashboard" params={{ status, search }} />
                </div>
            )}
        </div>
    );
}

export function TableSkeleton() {
    return (
        <div className="space-y-2 rounded-xl border bg-card p-4" aria-busy="true" aria-label="Loading submissions">
            {Array.from({ length: 5 }, (_, i) => (
                <Skeleton key={i} className="h-14 w-full" />
            ))}
        </div>
    );
}