import { NextResponse, type NextRequest } from "next/server";
import { ACCESS_COOKIE, REFRESH_COOKIE, accessCookieOptions, refreshCookieOptions } from "@/lib/cookies";

import { refreshTokens } from "@/service/refreshToken";

import { homeFor, verifyAccessToken } from "@/utils/jwt";

import type { AuthTokens } from "@/lib/types";

/**
 * Next.js 16 "proxy" (formerly middleware) - the single auth gate.
 *   Authentication: is there a valid access token? (silently refreshed with the refresh token when expired)
 *   Authorization : does the role in the token match the area being visited?
 * It only checks the JWT signature (no DB / API call), so it adds ~no latency.
 * The API re-checks everything, so this is UX + a first line of defence, not the only one.
 */
const AUTH_PAGES = ["/login", "/register"];
const STUDENT_AREA = "/dashboard";
const MENTOR_AREA = "/mentor-dashboard";

const inArea = (path: string, area: string) => path === area || path.startsWith(`${area}/`);

function applyCookies(res: NextResponse, tokens: AuthTokens) {

    res.cookies.set(ACCESS_COOKIE, tokens.accessToken, accessCookieOptions(tokens.accessTokenExpiresIn));
    res.cookies.set(REFRESH_COOKIE, tokens.refreshToken, refreshCookieOptions(tokens.refreshTokenExpiresIn));

    return res;
}

export async function proxy(req: NextRequest) {

    const { pathname } = req.nextUrl;

    const isAuthPage = AUTH_PAGES.includes(pathname);

    const isStudentArea = inArea(pathname, STUDENT_AREA);

    const isMentorArea = inArea(pathname, MENTOR_AREA);

    if (!isAuthPage && !isStudentArea && !isMentorArea) return NextResponse.next();

    let session = verifyAccessToken(req.cookies.get(ACCESS_COOKIE)?.value);

    let refreshed: AuthTokens | null = null;


    if (!session) {

        const refreshToken = req.cookies.get(REFRESH_COOKIE)?.value;

        if (refreshToken) {
            refreshed = await refreshTokens(refreshToken);
            if (refreshed) session = verifyAccessToken(refreshed.accessToken);
        }
    }


    if (!session) {
        if (isAuthPage) return NextResponse.next();

        const url = new URL("/login", req.url);
        url.searchParams.set("next", pathname);

        const res = NextResponse.redirect(url);

        res.cookies.delete(ACCESS_COOKIE);
        res.cookies.delete(REFRESH_COOKIE);

        return res;
    }

    const wrongArea = (isStudentArea && session.role !== "STUDENT") || (isMentorArea && session.role !== "MENTOR");

    if (isAuthPage || wrongArea) {

        const res = NextResponse.redirect(new URL(homeFor(session.role), req.url));

        return refreshed ? applyCookies(res, refreshed) : res;
    }


    if (refreshed) {
        // Make the NEW token visible to the page being rendered in this same request, and persist it in the browser.
        const jar = new Map(req.cookies.getAll().map((c) => [c.name, c.value]));

        jar.set(ACCESS_COOKIE, refreshed.accessToken);
        jar.set(REFRESH_COOKIE, refreshed.refreshToken);

        const headers = new Headers(req.headers);

        headers.set("cookie", [...jar].map(([k, v]) => `${k}=${v}`).join("; "));


        return applyCookies(NextResponse.next({ request: { headers } }), refreshed);
    }


    return NextResponse.next();
}


export const config = {

    matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],


};