import type { NextFunction, Request, Response } from "express";
import type { ZodType } from "zod";

import { AppError, type FieldError } from "../utils/AppError.js";

type Schemas = { body?: ZodType; query?: ZodType; params?: ZodType };

/**
 * Validates body / query / params with zod and stores the parsed (trimmed, coerced, defaulted)
 * result on req.validated. Express 5 makes req.query read-only, hence the separate property.
 */

export const validate = (schemas: Schemas) => (req: Request, _res: Response, next: NextFunction) => {

    const issues: FieldError[] = [];

    const validated: NonNullable<Request["validated"]> = {};

    for (const part of ["params", "query", "body"] as const) {

        const schema = schemas[part];
        if (!schema) continue;

        const result = schema.safeParse(req[part] ?? {});

        if (result.success) {
            validated[part] = result.data;
        }
        else {
            issues.push(
                ...result.error.issues.map((i) => ({

                    path: i.path.join(".") || part,
                    message: i.message,

                })),

            );
        }
    }


    if (issues.length) throw AppError.validation(issues);

    req.validated = validated;

    next();

};

/** Typed accessor for what `validate` stored. */
export const validated = <T>(req: Request, part: "body" | "query" | "params"): T =>
    req.validated?.[part] as T;