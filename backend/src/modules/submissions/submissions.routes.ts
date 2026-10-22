import { Router } from "express";
import { authenticate } from "../../middlewares/authenticate.js";
import { authorize } from "../../middlewares/authorize.js";
import { validate } from "../../middlewares/validate.js";
import * as controller from "./submissions.controller.js";

export const submissionsRouter = Router();

submissionsRouter.use(authenticate);


// Order matters: authenticate -> role check -> rate limit (per user) -> validation -> handler
submissionsRouter.post(
    "/",
    authorize("STUDENT"),
    // submissionLimiter,
    // validate({ body: createSubmissionSchema }),
    controller.create,
);

submissionsRouter.get("/me",
    authorize("STUDENT"),

    // validate({ query: paginationQuery }),
    // controller.listMine

);


submissionsRouter.get("/:id",
    // validate({ params: idParamSchema }),
    // controller.getOne
);