import jwt, { type JwtPayload } from "jsonwebtoken";

import type { Role } from "../generated/prisma/client.js";

import { env } from "../config/env.js";


export type AccessTokenPayload = {
    sub: string;
    role: Role;
};


export function signAccessToken(
    userId: string,
    role: Role
): string {
    return jwt.sign(
        { role },
        env.JWT_ACCESS_SECRET,
        {
            subject: userId,
            expiresIn: "15m"
        }
    );
}


export function signRefreshToken(userId: string): string {
    return jwt.sign(
        { type: "refresh" },
        env.JWT_REFRESH_SECRET,
        {
            subject: userId,
            expiresIn: "7d"
        }
    );
}

export function verifyAccessToken(
    token: string
): AccessTokenPayload {
    const payload = jwt.verify(
        token,
        env.JWT_ACCESS_SECRET
    ) as JwtPayload;

    if (
        typeof payload.sub !== "string" ||
        (payload.role !== "STUDENT" && payload.role !== "MENTOR")
    ) {
        throw new Error("Invalid access token payload");
    }

    return {
        sub: payload.sub,
        role: payload.role as Role
    };
}

export function verifyRefreshToken(token: string): string {
    const payload = jwt.verify(
        token,
        env.JWT_REFRESH_SECRET
    ) as JwtPayload;

    if (
        typeof payload.sub !== "string" ||
        payload.type !== "refresh"
    ) {
        throw new Error("Invalid refresh token");
    }

    return payload.sub;
}