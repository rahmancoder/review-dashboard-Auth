"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  ACCESS_COOKIE,
  REFRESH_COOKIE,
  accessCookieOptions,
  refreshCookieOptions
} from "@/lib/cookies";


import { backendFetch } from "@/lib/backendFetch";

import { toActionError } from "@/lib/actionResult";

import {
  loginSchema,
  registerSchema,
  type LoginValues,
  type RegisterValues
} from "@/lib/validations";


import { safeNext } from "@/lib/utils";

import { clearSession } from "@/service/logout";

import { homeFor } from "@/utils/jwt";
import type { ActionResult, AuthTokens, User } from "@/lib/types";

type AuthResponse = AuthTokens & { user: User };



const fieldErrorsFrom = (issues: { path: PropertyKey[]; message: string }[]) => {

  const out: Record<string, string> = {};

  for (const i of issues) {
    const key = String(i.path[0] ?? "");
    if (key && !out[key]) out[key] = i.message;
  }


  return out;
};

/** Stores both JWTs in httpOnly cookies - the browser's JS can never read them. */
async function setSessionCookies(t: AuthTokens) {

  const store = await cookies();

  store.set(ACCESS_COOKIE, t.accessToken, accessCookieOptions(t.accessTokenExpiresIn));

  store.set(REFRESH_COOKIE, t.refreshToken, refreshCookieOptions(t.refreshTokenExpiresIn));
}



export async function loginAction(values: LoginValues, next?: string | null): Promise<ActionResult> {
  // Never trust the client: validate again on the server.

  const parsed = loginSchema.safeParse(values);

  if (!parsed.success) {
    return { ok: false, message: "Please fix the highlighted fields", fieldErrors: fieldErrorsFrom(parsed.error.issues) };
  }




  let auth: AuthResponse;


  try {
    auth = (await backendFetch<AuthResponse>("/auth/login", { method: "POST", body: parsed.data, auth: false })).data;
  }

  catch (err) {
    return toActionError(err);
  }

  await setSessionCookies(auth);

  redirect(safeNext(next) ?? homeFor(auth.user.role)); // throws NEXT_REDIRECT - must stay outside try/catch
}





export async function registerAction(values: RegisterValues): Promise<ActionResult> {


  const parsed = registerSchema.safeParse(values);


  if (!parsed.success) {
    return { ok: false, message: "Please fix the highlighted fields", fieldErrors: fieldErrorsFrom(parsed.error.issues) };
  }
  const { name, email, password } = parsed.data;


  let auth: AuthResponse;



  try {
    auth = (await backendFetch<AuthResponse>("/auth/register", { method: "POST", body: { name, email, password }, auth: false })).data;
  }

  catch (err) {
    return toActionError(err);
  }

  await setSessionCookies(auth);

  redirect(homeFor(auth.user.role));
}




export async function logoutAction(): Promise<void> {

  await clearSession();

  redirect("/login");
}
