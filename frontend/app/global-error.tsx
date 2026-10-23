"use client";

/** Last-resort boundary: replaces the root layout itself, so it must render its own <html>/<body> and can't use Tailwind-dependent UI safely. */
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui, sans-serif", display: "grid", placeItems: "center", minHeight: "100vh", textAlign: "center" }}>

        <div>
          <h1>Something went seriously wrong</h1>

          <p>Please try again.</p>

          <button onClick={reset}>Reload</button>
        </div>

      </body>

    </html>
  );
}
