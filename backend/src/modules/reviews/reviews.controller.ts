import type { Request, Response } from "express";
import { buildMeta, sendSuccess } from "../../utils/response.js";
import { validated } from "../../middlewares/validate.js";
import * as service from "./reviews.service.js";


import type { ListReviewsQuery, ReviewDecisionInput } from "./reviews.schema.js";



export const list = async (req: Request, res: Response) => {

    const query = validated<ListReviewsQuery>(req, "query");

    const { items, total } = await service.listSubmissions(query);

    return sendSuccess(
        res,
        items,
        200,
        buildMeta(query.page, query.limit, total));

};


export const stats = async (_req: Request, res: Response) => sendSuccess(
    res,
    await service.getStats()
);



export const decide = async (req: Request, res: Response) =>
    sendSuccess(
        res,
        await service.reviewSubmission(
            req.user!.id,
            validated<{ id: string }>(req, "params").id,
            validated<ReviewDecisionInput>(req, "body"),
        ),
    );