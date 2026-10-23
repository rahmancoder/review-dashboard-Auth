export const ACCESS_COOKIE = "accessToken";
export const REFRESH_COOKIE = "refreshToken";

const base = {
    httpOnly: true, // not readable from JS => XSS cannot steal the tokens
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const, // blocks cross-site POSTs (CSRF) while allowing normal navigation
    path: "/",
};

export const accessCookieOptions = (maxAgeSeconds: number) => ({ ...base, maxAge: maxAgeSeconds });
export const refreshCookieOptions = (maxAgeSeconds: number) => ({ ...base, maxAge: maxAgeSeconds });