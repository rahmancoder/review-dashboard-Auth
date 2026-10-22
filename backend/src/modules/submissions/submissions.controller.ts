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

    const { items, total } = await service.listMySubmissions(req.user!.id, query);

    return sendSuccess(
        res,
        items,
        200,
        buildMeta(query.page, query.limit, total));
};

export const getOne = async (req: Request, res: Response) =>


    sendSuccess(
        res,
        await service.getSubmission(validated<{ id: string }>(req, "params").id,
            req.user!
        )
    );

