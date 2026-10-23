import "server-only";
import { cookies } from "next/headers";

import { ACCESS_COOKIE } from "@/lib/cookies";

import { verifyAccessToken } from "@/utils/jwt";

/** Cheap, network-free session read (verifies the JWT signature) - used for public pages / navbar. */
export async function getSession() {

  return verifyAccessToken((await cookies()).get(ACCESS_COOKIE)?.value);
}
