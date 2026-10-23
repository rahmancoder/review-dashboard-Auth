import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { UserMenu } from "@/components/shared/user-menu";
import { cn } from "@/lib/utils";
import type { Role, User } from "@/lib/types";

const links: Record<Role, { href: string; label: string }[]> = {
  STUDENT: [
    { href: "/dashboard/submit", label: "Submit project" },
    { href: "/dashboard/my-submissions", label: "My submissions" },
  ],
  MENTOR: [{ href: "/mentor-dashboard", label: "Review dashboard" }],
};

/** `user` is the full profile (dashboard) or just the role from the JWT (public pages). */
export function Navbar({ user }: { user: Pick<User, "role"> & Partial<Pick<User, "name" | "email">> | null }) {
  return (
    <header className="sticky top-0 z-40 border-b bg-card/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <GraduationCap className="size-5 text-primary" aria-hidden /> ProjectReview
          </Link>
          {user && (
            <nav className="hidden items-center gap-1 sm:flex">
              {links[user.role].map((l) => (
                <Link key={l.href} href={l.href} className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}>
                  {l.label}
                </Link>
              ))}
            </nav>
          )}
        </div>
        <div className="flex items-center gap-2">
          {user?.name && user.email ? (
            <UserMenu user={{ name: user.name, email: user.email, role: user.role }} />
          ) : user ? (
            <Link href={user.role === "MENTOR" ? "/mentor-dashboard" : "/dashboard/my-submissions"} className={buttonVariants({ size: "sm" })}>
              Go to dashboard
            </Link>
          ) : (
            <>
              <Link href="/login" className={buttonVariants({ variant: "ghost", size: "sm" })}>
                Log in
              </Link>
              <Link href="/register" className={buttonVariants({ size: "sm" })}>
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
