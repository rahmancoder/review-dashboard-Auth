import { rateLimit } from "express-rate-limit";
import type { Request, Response } from "express";
import { env } from "../config/env.js";



const handler = (message: string) => (req: Request, res: Response) => {

    const resetTime = (req as Request & { rateLimit?: { resetTime?: Date } }).rateLimit?.resetTime;

    const retryAfterSeconds = resetTime
        ? Math.max(1, Math.ceil((resetTime.getTime() - Date.now()) / 1000))
        : undefined;
    res.status(429).json({
        success: false,
        error: { code: "RATE_LIMITED", message, ...(retryAfterSeconds ? { retryAfterSeconds } : {}) },
    });
};


/** Loose safety net for the whole API (per IP). */
export const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    handler: handler("Too many requests. Please slow down."),
});


/** Brute-force protection for login / signup (per IP). */
export const authLimiter = rateLimit({
    windowMs: env.AUTH_RATE_LIMIT_WINDOW_MINUTES * 60 * 1000,
    limit: env.AUTH_RATE_LIMIT_MAX,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    handler: handler("Too many authentication attempts. Please try again later."),
});

/**
 * Spam protection for POST /submissions.
 * Keyed by authenticated user id (not IP) so students sharing a campus/NAT IP don't throttle each other.
 * Must be mounted AFTER `authenticate`.
 */
export const submissionLimiter = rateLimit({

    windowMs: env.SUBMISSION_RATE_LIMIT_WINDOW_MINUTES * 60 * 1000,
    limit: env.SUBMISSION_RATE_LIMIT_MAX,

    standardHeaders: "draft-8",
    legacyHeaders: false,

    keyGenerator: (req) => req.user?.id ?? "anonymous",
    handler: handler(
        `Submission limit reached (${env.SUBMISSION_RATE_LIMIT_MAX} per ${env.SUBMISSION_RATE_LIMIT_WINDOW_MINUTES} minutes). Please wait before submitting again.`,
    ),
});