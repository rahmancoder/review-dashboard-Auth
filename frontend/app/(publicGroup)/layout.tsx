import { Footer } from "@/components/shared/footer";
import { Navbar } from "@/components/shared/navbar";
import { getSession } from "@/service/getSession";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession(); // JWT signature check only - no API call
  return (
    <div className="flex min-h-screen flex-col">

      <Navbar user={session ? { role: session.role } : null} />

      <main className="flex-1">{children}</main>

      <Footer />

    </div>
  );
}
