import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "ProjectReview", template: "%s · ProjectReview" },
  description: "Students submit projects, mentors review them.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">

      <body className="min-h-screen">

        {children}
        <Toaster />

      </body>

    </html>
  );
}
