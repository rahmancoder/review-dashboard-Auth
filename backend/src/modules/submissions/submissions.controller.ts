import type { Request, Response } from "express";
import { buildMeta, sendSuccess } from "../../utils/response.js";

import { validated } from "../../middlewares/validate.js";
import * as service from "./submissions.service.js";

import type { CreateSubmissionInput, PaginationQuery } from "./submissions.schema.js";

export const create = async (req: Request, res: Response) =>
    sendSuccess(
        res,
        await service.createSubmission(
            req.user!.id,
            validated<CreateSubmissionInput>(req, "body")),
        201
    );

export const listMine = async (req: Request, res: Response) => {
    const query = validated<PaginationQuery>(req, "query");

    return {};
};

