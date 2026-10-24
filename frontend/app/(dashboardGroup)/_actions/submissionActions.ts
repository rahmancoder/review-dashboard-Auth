"use server";

import { revalidatePath } from "next/cache";

import { backendFetch } from "@/lib/backendFetch";
import { toActionError } from "@/lib/actionResult";

import { submissionSchema, type SubmissionValues } from "@/lib/validations";

import type { ActionResult, Submission } from "@/lib/types";

/**
 * Defensive submission (Topic 2D) - layers, outermost first:
 *  1. client: zod + react-hook-form (instant feedback)       2. here: zod again (never trust the client)
 *  3. API: zod again + rate limit (5 / 10 min / user)         4. DB: UNIQUE(repoKey) - the race-proof duplicate guard
 * Every layer reports problems as { field -> message } so the form can show them next to the right input.
 */

export async function createSubmissionAction(values: SubmissionValues): Promise<ActionResult<{ id: string }>> {

    const parsed = submissionSchema.safeParse(values);


    if (!parsed.success) {

        const fieldErrors: Record<string, string> = {};


        for (const i of parsed.error.issues) fieldErrors[String(i.path[0])] ??= i.message;

        return { ok: false, message: "Please fix the highlighted fields", fieldErrors };
    }


    try {

        const { data } = await backendFetch<Submission>("/submissions", { method: "POST", body: parsed.data });

        revalidatePath("/dashboard/my-submissions"); // cache invalidation: next visit shows the new row

        return { ok: true, data: { id: data.id } };
    }

    catch (err) {
        return toActionError(err);
    }
}