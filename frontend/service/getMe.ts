import "server-only";
import { cache } from "react";

import { ApiError } from "@/lib/api-error";
import { backendFetch } from "@/lib/backendFetch";

import type { User } from "@/lib/types";

/** Current user from the API. `cache()` dedupes calls within one render pass (layout + page share one request). */
export const getMe = cache(async (): Promise<User | null> => {
  try {

    return (await backendFetch<User>("/auth/me")).data;
  }

  catch (err) {

    if (err instanceof ApiError && err.status === 401) return null;
    throw err;
  }
});
