import "server-only";
import { cookies } from "next/headers";
import { ACCESS_COOKIE } from "@/lib/cookies";
import { ApiError } from "@/lib/api-error";
import type { PaginationMeta } from "@/lib/types";

const BASE_URL = process.env.BACKEND_URL ?? "http://localhost:5000/api/v1";

type Options = {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  query?: Record<string, string | number | undefined | null>;
  /** attach the access-token cookie as a Bearer token (default true) */
  auth?: boolean;
};

export type BackendResponse<T> = { data: T; meta?: PaginationMeta };

/**
 * The ONLY place that talks to the Express API from Next.js (server-only => the backend URL and tokens never reach the browser).
 * Normalises every failure (network down, non-JSON, 4xx/5xx) into an ApiError.
 */
export async function backendFetch<T>(path: string, opts: Options = {}): Promise<BackendResponse<T>> {

  const { method = "GET", body, query, auth = true } = opts;

  const url = new URL(`${BASE_URL}${path}`);

  for (const [k, v] of Object.entries(query ?? {})) if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, String(v));

  const headers: Record<string, string> = { Accept: "application/json" };

  if (body !== undefined) headers["Content-Type"] = "application/json";



  if (auth) {

    const token = (await cookies()).get(ACCESS_COOKIE)?.value;

    if (!token) throw new ApiError(401, "UNAUTHORIZED", "You are not signed in");

    headers.Authorization = `Bearer ${token}`;
  }



  let res: Response;


  try {
    res = await fetch(url, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });
  }


  catch {
    throw new ApiError(503, "NETWORK_ERROR", "Cannot reach the server. Please try again in a moment.");
  }



  let json: any = null;


  try {
    json = await res.json();
  }

  catch {
    /* non-JSON body */
  }

  if (!res.ok || !json?.success) {

    throw new ApiError(
      res.status,
      json?.error?.code ?? "UNKNOWN_ERROR",
      json?.error?.message ?? `Request failed (${res.status})`,
      json?.error?.details,
    );

  }


  return { data: json.data as T, meta: json.meta };

}
