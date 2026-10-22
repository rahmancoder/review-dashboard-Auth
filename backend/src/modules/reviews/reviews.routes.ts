import { Router } from "express";
import { authenticate } from "../../middlewares/authenticate.js";
import { authorize } from "../../middlewares/authorize.js";
import { validate } from "../../middlewares/validate.js";
import { idParamSchema } from "../submissions/submissions.schema.js";
import * as controller from "./reviews.controller.js";


import { listReviewsQuery, reviewDecisionSchema } from "./reviews.schema.js";




export const reviewsRouter = Router();

// Every route below: valid JWT + MENTOR role claim
reviewsRouter.use(
    authenticate,
    authorize("MENTOR")
);

reviewsRouter.get("/submissions",
    // validate({ query: listReviewsQuery }), 
    controller.list);

reviewsRouter.get("/stats",
    controller.stats
);

reviewsRouter.patch(

    "/submissions/:id/status",

    // validate({ params: idParamSchema, body: reviewDecisionSchema }),

    controller.decide,
);