import Link from "next/link";
import { AlertTriangle } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";

/** Section-level failure: only this block shows an error, the rest of the page keeps working. */
export function InlineError({ message, retryHref }: { message: string; retryHref: string }) {
    return (

        <div role="alert" className="flex flex-col items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-8 text-center text-sm text-red-700">

            <AlertTriangle className="size-5" aria-hidden />

            <p>{message}</p>

            <Link href={retryHref} className={buttonVariants({ variant: "outline", size: "sm" })}>
                Retry
            </Link>

        </div>
    );
}