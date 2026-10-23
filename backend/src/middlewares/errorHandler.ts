import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { Prisma } from "../generated/prisma/client.js";
import { env } from "../config/env.js";
import { AppError } from "../utils/AppError.js";

type ErrorBody = {
    success: false;
    error: { code: string; message: string; details?: { path: string; message: string }[] };
};

const send = (res: Response, status: number, error: ErrorBody["error"]) =>
    res.status(status).json({ success: false, error } satisfies ErrorBody);

/** Single place where every thrown error becomes a structured JSON response. */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
    if (err instanceof AppError) {
        return send(res, err.statusCode, {
            code: err.code,
            message: err.message,
            ...(err.details ? { details: err.details } : {}),
        });
    }

    if (err instanceof ZodError) {
        return send(res, 400, {
            code: "VALIDATION_ERROR",
            message: "Validation failed",
            details: err.issues.map((i) => ({ path: i.path.join("."), message: i.message })),
        });
    }

    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2002") {
            return send(res, 409, { code: "CONFLICT", message: "A record with these values already exists" });
        }
        if (err.code === "P2025") {
            return send(res, 404, { code: "NOT_FOUND", message: "Record not found" });
        }
    }

    // body-parser errors (malformed JSON, payload too large)
    const maybeHttp = err as { type?: string; status?: number };
    if (maybeHttp?.type === "entity.parse.failed") {
        return send(res, 400, { code: "INVALID_JSON", message: "Request body is not valid JSON" });
    }
    if (maybeHttp?.type === "entity.too.large") {
        return send(res, 413, { code: "PAYLOAD_TOO_LARGE", message: "Request body is too large" });
    }

    console.error("Unhandled error:", err);
    return send(res, 500, {
        code: "INTERNAL_SERVER_ERROR",
        message: env.isProd ? "Something went wrong" : err instanceof Error ? err.message : "Unknown error",
    });
}