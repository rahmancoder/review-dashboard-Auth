import jwt from "jsonwebtoken";
import { z } from "zod";
import { env } from "../config/env.js";

import type { Role } from "../generated/prisma/enums.js";

export type AuthTokenPayload = { sub: string; role: Role };


const payloadSchema = z.object({
    sub: z.string().min(1),
    role: z.enum(["STUDENT", "MENTOR"]),
});


export function signAccessToken(payload: AuthTokenPayload): string {

    return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
        expiresIn: env.JWT_ACCESS_TTL_SECONDS,
        algorithm: "HS256",
    });
}


export function signRefreshToken(payload: AuthTokenPayload): string {

    return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
        expiresIn: env.JWT_REFRESH_TTL_SECONDS,
        algorithm: "HS256",
    });
}

/** Throws jsonwebtoken errors (TokenExpiredError / JsonWebTokenError) on failure. */
export function verifyAccessToken(token: string): AuthTokenPayload {

    const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET, { algorithms: ["HS256"] });

    return payloadSchema.parse(decoded);
}



export function verifyRefreshToken(token: string): AuthTokenPayload {

    const decoded = jwt.verify(token, env.JWT_REFRESH_SECRET, { algorithms: ["HS256"] });

    return payloadSchema.parse(decoded);
}