import type { Response } from "express";

type SuccessResponse<T> = {
    success: true;
    message: string;
    data: T;
};

export function sendSuccess<T>(
    res: Response,
    data: T,
    message = "Request successful",
    statusCode = 200
) {
    const response: SuccessResponse<T> = {
        success: true,
        message,
        data
    };


    return res.status(statusCode).json(response);
}