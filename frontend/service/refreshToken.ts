import type { AuthTokens } from "@/lib/types";


/** Exchanges a refresh token for a new pair. Used by proxy.ts (plain fetch - the proxy has no access to server-only helpers). */
export async function refreshTokens(refreshToken: string): Promise<AuthTokens | null> {


  try {
    const res = await fetch(`${process.env.BACKEND_URL ?? "http://localhost:5000/api/v1"}/auth/refresh`, {

      method: "POST",
      headers: { "Content-Type": "application/json" },

      body: JSON.stringify({ refreshToken }),

      cache: "no-store",

      signal: AbortSignal.timeout(5_000),

    });

    const json = await res.json();


    return res.ok && json?.success ? (json.data as AuthTokens) : null;
  }


  catch {
    return null;
  }
}
