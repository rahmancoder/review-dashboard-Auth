import jwt from "jsonwebtoken";
import type { Role } from "@/lib/types";

export type Session = { userId: string; role: Role };

/** Verifies the access token locally (HMAC) - no network call. Returns null when missing / invalid / expired. */
export function verifyAccessToken(token: string | undefined | null): Session | null {
    if (!token) return null;
    const secret = process.env.JWT_ACCESS_SECRET;
    if (!secret) throw new Error("JWT_ACCESS_SECRET is not set");
    try {
        const p = jwt.verify(token, secret, { algorithms: ["HS256"] }) as jwt.JwtPayload;
        if (typeof p.sub !== "string" || (p.role !== "STUDENT" && p.role !== "MENTOR")) return null;
        return { userId: p.sub, role: p.role };
    } catch {
        return null;
    }
}

export const homeFor = (role: Role) => (role === "MENTOR" ? "/mentor-dashboard" : "/dashboard/my-submissions");