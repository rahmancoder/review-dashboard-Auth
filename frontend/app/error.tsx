"use client";

import { useEffect } from "react";
import Link from "next/link";

import { Button, buttonVariants } from "@/components/ui/button";

/** Root error boundary (500). `reset()` re-renders the segment so transient failures can recover without a full reload. */
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-3 px-4 text-center">

      <p className="text-sm font-semibold text-destructive">500</p>

      <h1 className="text-3xl font-bold tracking-tight">Something went wrong</h1>

      <p className="max-w-md text-muted-foreground">An unexpected error occurred. You can try again or go back home.</p>

      {error.digest && <p className="text-xs text-muted-foreground">Reference: {error.digest}</p>}

      <div className="flex gap-2">

        <Button onClick={reset}>Try again</Button>

        <Link href="/" className={buttonVariants({ variant: "outline" })}>
          Home
        </Link>

      </div>

    </main>
  );
}
