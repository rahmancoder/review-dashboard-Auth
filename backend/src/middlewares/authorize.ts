import type { NextFunction, Request, Response } from "express";

import type { Role } from "../generated/prisma/enums.js";

import { AppError } from "../utils/AppError.js";

/**
 * AUTHORIZATION (RBAC): "what are you allowed to do?"
 * Coarse, role-level gate based on the signed `role` claim - O(1), no DB hit.
 * Resource-level checks (ownership, current status, user still exists) happen in the services.
 */
export const authorize =
    (...allowed: Role[]) =>
        (req: Request, _res: Response, next: NextFunction) => {

            if (!req.user) throw AppError.unauthorized();

            if (!allowed.includes(req.user.role)) throw AppError.forbidden();

            next();

        };