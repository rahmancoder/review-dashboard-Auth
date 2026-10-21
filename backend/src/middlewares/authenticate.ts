import type { RequestHandler } from "express";

import { verifyAccessToken } from "../lib/jwt.js";

import { AppError } from "../utils/AppError.js";

export const authenticate: RequestHandler = (
    req,
    _res,
    next
) => {
    const authorization = req.headers.authorization;

    if (!authorization?.startsWith("Bearer ")) {
        next(new AppError("Authentication required", 401));
        return;
    }

    const token = authorization.slice("Bearer ".length).trim();

    if (!token) {
        next(new AppError("Authentication required", 401));
        return;
    }

    try {
        const payload = verifyAccessToken(token);

        req.user = {
            id: payload.sub,
            role: payload.role
        };

        next();
    } catch {
        next(new AppError("Invalid or expired access token", 401));
    }
};