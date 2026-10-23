import Link from "next/link";
import { GraduationCap } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 py-10">

            <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
                <GraduationCap className="size-6 text-primary" aria-hidden /> ProjectReview
            </Link>

            <div className="w-full max-w-sm">{children}</div>

        </main>
    );
}