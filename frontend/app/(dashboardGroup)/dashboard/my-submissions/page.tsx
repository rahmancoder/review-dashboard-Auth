import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { Pagination } from "@/components/shared/pagination";
import { ApiError } from "@/lib/api-error";
import { backendFetch } from "@/lib/backendFetch";
import type { PaginationMeta, Submission } from "@/lib/types";

import { SubmissionCard } from "../../_components/SubmissionCard";





export const metadata: Metadata = { title: "My submissions" };

export default async function MySubmissionsPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {

    const page = Math.max(1, Number.parseInt((await searchParams).page ?? "1", 10) || 1);

    let items: Submission[] = [];

    let meta: PaginationMeta | undefined;

    try {
        const res = await backendFetch<Submission[]>("/submissions/me", { query: { page, limit: 6 } });
        items = res.data;
        meta = res.meta;
    }

    catch (err) {

        if (err instanceof ApiError && err.status === 401) redirect("/login");
        throw err; // handled by the dashboard error boundary
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">My submissions</h1>

                <Link href="/dashboard/submit" className={buttonVariants({ size: "sm" })}>
                    <Plus /> New submission
                </Link>

            </div>

            {items.length === 0 ? (
                <EmptyState
                    title="No submissions yet"
                    description="Submit your first project to get feedback from a mentor."

                    action={

                        <Link href="/dashboard/submit" className={buttonVariants()}>
                            Submit a project
                        </Link>
                    }
                />
            ) : (
                <>
                    <div className="grid gap-4 md:grid-cols-2">
                        {items.map((s) => (
                            <SubmissionCard key={s.id} submission={s} />
                        ))}
                    </div>

                    {meta && meta.totalPages > 1 && <Pagination meta={meta} basePath="/dashboard/my-submissions" />}
                </>
            )}
        </div>
    );
}