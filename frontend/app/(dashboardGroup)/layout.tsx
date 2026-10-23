import { redirect } from "next/navigation";
import { Navbar } from "@/components/shared/navbar";
import { getMe } from "@/service/getMe";

/**
 * proxy.ts already blocks anonymous users and wrong roles before we get here.
 * This is the second layer: load the real profile (also proves the account still exists).
 */
export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getMe();
  if (!user) redirect("/login");

  return (
    <div className="min-h-screen">
      <Navbar user={user} />
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
