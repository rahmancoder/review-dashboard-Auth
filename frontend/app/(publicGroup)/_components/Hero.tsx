import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-20 text-center">
      <
        h1 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl">Ship your project. Get it reviewed.</h1>

      <p className="mt-4 text-lg text-muted-foreground text-balance">
        Students submit their repository and live link; mentors approve or send feedback - all in one clean dashboard.
      </p>

      <div className="mt-8 flex justify-center gap-3">

        <Link href="/register" className={buttonVariants({ size: "lg" })}>
          Get started
        </Link>

        <Link href="/login" className={buttonVariants({ size: "lg", variant: "outline" })}>
          Log in
        </Link>

      </div>

    </section>
  );
}
