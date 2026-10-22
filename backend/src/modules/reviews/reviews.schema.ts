import { z } from "zod";
import { paginationQuery } from "../submissions/submissions.schema.js";

export const listReviewsQuery = paginationQuery.extend({

    status: z.enum(["PENDING", "APPROVED", "REJECTED"]).optional(),
    search: z.string().trim().max(100).optional(),
});


export const reviewDecisionSchema = z
    .object({

        status: z.enum(["APPROVED", "REJECTED"], { error: "Status must be APPROVED or REJECTED" }),
        comment: z.string().trim().max(1000, "Comment must be at most 1000 characters").optional(),
    })
    .refine((v) => v.status !== "REJECTED" || (v.comment && v.comment.length >= 5), {
        path: ["comment"],
        message: "Please give the student a reason (at least 5 characters) when rejecting",
    });


export type ListReviewsQuery = z.infer<typeof listReviewsQuery>;
export type ReviewDecisionInput = z.infer<typeof reviewDecisionSchema>;