import Link from "next/link";
import { redirect } from "next/navigation";
import { CheckCircle2, Clock, Layers, XCircle } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { ApiError } from "@/lib/api-error";

import { backendFetch } from "@/lib/backendFetch";
import type { ReviewStats } from "@/lib/types";

import { InlineError } from "./InlineError";

const items = [
    { key: "total", label: "Total", href: "/mentor-dashboard?status=ALL", Icon: Layers, tone: "text-foreground" },
    { key: "pending", label: "Pending", href: "/mentor-dashboard?status=PENDING", Icon: Clock, tone: "text-amber-600" },
    { key: "approved", label: "Approved", href: "/mentor-dashboard?status=APPROVED", Icon: CheckCircle2, tone: "text-emerald-600" },
    { key: "rejected", label: "Rejected", href: "/mentor-dashboard?status=REJECTED", Icon: XCircle, tone: "text-red-600" },
] as const;

/** Async server component: streams in on its own, independently of the table. */
export async function StatsCards() {
    let stats: ReviewStats;
    try {
        stats = (await backendFetch<ReviewStats>("/reviews/stats")).data;
    } catch (err) {
        if (err instanceof ApiError && err.status === 401) redirect("/login");
        return <InlineError message="Couldn't load statistics." retryHref="/mentor-dashboard" />;
    }

    return (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {items.map(({ key, label, href, Icon, tone }) => (
                <Link key={key} href={href} className="rounded-xl focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none">
                    <Card className="gap-2 transition-colors hover:bg-accent/40">
                        <CardContent className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">{label}</p>
                                <p className="text-3xl font-bold tabular-nums">{stats[key]}</p>
                            </div>
                            <Icon className={`size-6 ${tone}`} aria-hidden />
                        </CardContent>
                    </Card>
                </Link>
            ))}
        </div>
    );
}

export function StatsSkeleton() {
    return (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4" aria-busy="true">
            {Array.from({ length: 4 }, (_, i) => (
                <Skeleton key={i} className="h-[88px] rounded-xl" />
            ))}
        </div>
    );
}