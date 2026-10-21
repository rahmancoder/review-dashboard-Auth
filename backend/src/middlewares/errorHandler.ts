import type { ErrorRequestHandler, RequestHandler } from "express";

import { AppError } from "../utils/AppError.js";


export const notFoundHandler: RequestHandler = (
    req,
    _res,
    next
) => {
    next(new AppError(`Route not found: ${req.method} ${req.path}`, 404));
};

export const errorHandler: ErrorRequestHandler = (
    error,
    _req,
    res,
    _next
) => {
    const statusCode =
        error instanceof AppError ? error.statusCode : 500;

    const message =
        error instanceof AppError
            ? error.message
            : "Internal server error";


    if (statusCode >= 500) {
        console.error(error);
    }


    return res.status(statusCode).json({
        success: false,
        message
    });


};