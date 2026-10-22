import type { Request, Response } from "express";
import { sendSuccess } from "../../utils/response.js";

import { validated } from "../../middlewares/validate.js";

import * as service from "./auth.service.js";

import type { LoginInput, RefreshInput, RegisterInput } from "./auth.schema.js";



export const register = async (req: Request, res: Response) =>
    sendSuccess(
        res,
        await service.register(validated<RegisterInput>(req, "body")),
        201
    );


export const login = async (req: Request, res: Response) =>

    sendSuccess(
        res,
        await service.login(validated<LoginInput>(req, "body"))
    );


export const refresh = async (req: Request, res: Response) =>

    sendSuccess(
        res,
        await service.refresh(validated<RefreshInput>(req, "body").refreshToken)
    );


export const me = async (req: Request, res: Response) =>

    sendSuccess(
        res,
        await service.getMe(req.user!.id)
    );