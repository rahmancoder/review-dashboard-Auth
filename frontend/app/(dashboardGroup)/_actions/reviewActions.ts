"use server";

import { revalidatePath } from "next/cache";

import { backendFetch } from "@/lib/backendFetch";

import { toActionError } from "@/lib/actionResult";

import { rejectSchema } from "@/lib/validations";


import type { ActionResult, Submission } from "@/lib/types";



export async function reviewSubmissionAction(
    submissionId: string,
    status: "APPROVED" | "REJECTED",
    comment?: string,
): Promise<ActionResult> {

    if (status === "REJECTED") {
        const parsed = rejectSchema.safeParse({ comment });

        if (!parsed.success) return {
            ok: false,
            message: parsed.error.issues[0]?.message ?? "Invalid comment",
            fieldErrors: { comment: parsed.error.issues[0]?.message ?? "Invalid" }
        };
    }

    try {
        await backendFetch<Submission>(`/reviews/submissions/${submissionId}/status`, {
            method: "PATCH",
            body: { status, comment: comment?.trim() || undefined },
        });

        revalidatePath("/mentor-dashboard"); // refreshes table + stats (all filter/page variants)


        return {
            ok: true,
            data: undefined
        };

    }


    catch (err) {


        const res = toActionError(err);
        // 409 = another mentor already decided; refresh so this mentor sees the current state
        if (res.status === 409 || res.status === 404) revalidatePath("/mentor-dashboard");


        return res;
    }
}