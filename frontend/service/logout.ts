import "server-only";
import { cookies } from "next/headers";


import { ACCESS_COOKIE, REFRESH_COOKIE } from "@/lib/cookies";

/** Tokens are stateless JWTs, so logging out = deleting both cookies. */
export async function clearSession() {

  const store = await cookies();

  store.delete(ACCESS_COOKIE);
  store.delete(REFRESH_COOKIE);
}
