import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { verifyAccessToken } from "../lib/jwt.js";
import { AppError } from "../utils/AppError.js";

/**
 * AUTHENTICATION: "who are you?"
 * Verifies the Bearer JWT (signature + expiry) and attaches { id, role } to req.user.
 * Purely CPU-bound (HMAC check) - no database round-trip, so it is cheap enough to run on every request.
 */
export function authenticate(req: Request, _res: Response, next: NextFunction) {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
        throw AppError.unauthorized("Missing or malformed Authorization header");
    }

    try {
        const { sub, role } = verifyAccessToken(header.slice(7));
        req.user = { id: sub, role };
        next();
    } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
            // Distinct code lets the frontend know it should call /auth/refresh
            throw new AppError(401, "TOKEN_EXPIRED", "Access token expired");
        }
        throw AppError.unauthorized("Invalid access token");
    }
}