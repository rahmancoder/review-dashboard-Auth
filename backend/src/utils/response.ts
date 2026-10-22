import type { Response } from "express";

export type PaginationMeta = {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
};

export function sendSuccess<T>(res: Response, data: T, status = 200, meta?: PaginationMeta) {

    return res.status(status).json({
        success: true,
        data, ...(meta ? { meta } : {})
    });

}

export const buildMeta = (page: number, limit: number, total: number): PaginationMeta => ({
    page,
    limit,
    total,
    totalPages: Math.max(1, Math.ceil(total / limit)),
});