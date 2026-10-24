import type { Metadata } from "next";
import { Suspense } from "react";

import { ReviewTable, TableSkeleton } from "../_components/ReviewTable";

import { SearchForm } from "../_components/SearchForm";

import { StatsCards, StatsSkeleton } from "../_components/StatsCards";

import { FILTERS, StatusFilter, type FilterValue } from "../_components/StatusFilter";





export const metadata: Metadata = { title: "Review dashboard" };


export default async function MentorDashboardPage({
    searchParams,
}: {
    searchParams: Promise<{ status?: string; page?: string; search?: string }>;
}) {

    const sp = await searchParams;

    const status: FilterValue = FILTERS.find((f) => f.value === sp.status)?.value ?? "PENDING"; // default view = review queue

    const page = Math.max(1, Number.parseInt(sp.page ?? "1", 10) || 1);

    const search = sp.search?.trim().slice(0, 100) || undefined;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold tracking-tight">Review dashboard</h1>

            {/* Two independent Suspense boundaries: stats and table stream in separately, each with its own skeleton + error state */}

            <Suspense fallback={<StatsSkeleton />}>
                <StatsCards />
            </Suspense>

            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <StatusFilter active={status} search={search} />
                <SearchForm status={status} search={search} />
            </div>


            {/* `key` makes the skeleton show again whenever filter / page / search changes */}

            <Suspense key={`${status}-${page}-${search ?? ""}`} fallback={<TableSkeleton />}>
                <ReviewTable status={status} page={page} search={search} />
            </Suspense>

        </div>
    );
}