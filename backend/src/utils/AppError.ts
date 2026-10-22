export type FieldError = { path: string; message: string };


export class AppError extends Error {



    constructor(
        public readonly statusCode: number,
        public readonly code: string,
        message: string,
        public readonly details?: FieldError[],
    ) {

        super(message);
        this.name = "AppError";

    }


    static badRequest(message: string, details?: FieldError[]) {

        return new AppError(400, "BAD_REQUEST", message, details);
    }

    static validation(details: FieldError[], message = "Validation failed") {

        return new AppError(400, "VALIDATION_ERROR", message, details);
    }


    static unauthorized(message = "Authentication required") {

        return new AppError(401, "UNAUTHORIZED", message);
    }

    static forbidden(message = "You do not have permission to perform this action") {

        return new AppError(403, "FORBIDDEN", message);
    }


    static notFound(message = "Resource not found") {

        return new AppError(404, "NOT_FOUND", message);
    }


    static conflict(message: string, details?: FieldError[]) {

        return new AppError(409, "CONFLICT", message, details);
    }


}