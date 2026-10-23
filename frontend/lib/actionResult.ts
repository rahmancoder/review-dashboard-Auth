import { ApiError } from "@/lib/api-error";
import type { ActionResult } from "@/lib/types";

/** Turns anything thrown by backendFetch into a serialisable ActionResult the UI can render. */
export function toActionError(err: unknown): Extract<ActionResult, { ok: false }> {

  if (err instanceof ApiError) {

    const fieldErrors: Record<string, string> = {};

    for (const d of err.details ?? []) if (!fieldErrors[d.path]) fieldErrors[d.path] = d.message;

    return {
      ok: false,
      message: err.message,
      status: err.status,
      ...(Object.keys(fieldErrors).length ? { fieldErrors } : {}),
    };
  }


  console.error(err);


  return {
    ok: false,
    message: "Something went wrong. Please try again."
  };
}
