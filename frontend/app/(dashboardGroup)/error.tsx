"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

/** Error boundary for everything inside the dashboard - the navbar (layout) stays visible and the user can retry in place. */
export default function DashboardError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div role="alert" className="mx-auto flex max-w-md flex-col items-center gap-3 rounded-xl border bg-card px-6 py-12 text-center">
      <AlertTriangle className="size-8 text-destructive" aria-hidden />
      <h2 className="text-lg font-semibold">We couldn&rsquo;t load this page</h2>
      <p className="text-sm text-muted-foreground">
        {process.env.NODE_ENV === "development" ? error.message : "Something went wrong on our side. Please try again."}
      </p>
      {error.digest && <p className="text-xs text-muted-foreground">Reference: {error.digest}</p>}
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
