import { Prisma } from "../../generated/prisma/client.js";
import { prisma } from "../../lib/prisma.js";
import { AppError } from "../../utils/AppError.js";

import type { CreateSubmissionInput, PaginationQuery } from "./submissions.schema.js";


const withLatestFeedback = {
    feedbacks: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: {
            id: true,
            decision: true,
            comment: true,
            createdAt: true,
            mentor: {
                select: {
                    name: true
                }
            }
        },
    },

} satisfies Prisma.SubmissionInclude;



export async function createSubmission(studentId: string, input: CreateSubmissionInput) {

    ;
    const repoKey = input.repoUrl;

    // Friendly pre-check (gives a field-level error)...
    const existing = await prisma.submission.findUnique({
        where: {
            repoKey
        },
        select: {
            studentId: true
        }
    });

    if (existing) throw duplicateError(existing.studentId === studentId);

    try {
        return await prisma.submission.create({

            data: {
                ...input,
                repoKey,
                studentId
            },
            include: withLatestFeedback,

        });
    }

    catch (err) {
        // ...and the UNIQUE(repoKey) index is the real guarantee when two requests race.
        if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
            throw duplicateError(true);
        }

        throw err;
    }
}

const duplicateError = (own: boolean) =>
    AppError.conflict(
        own ? "You have already submitted this repository" : "This repository has already been submitted", [
        {
            path: "repoUrl",
            message: own ? "You have already submitted this repository" : "This repository has already been submitted"
        },
    ]);



export async function listMySubmissions(studentId: string, { page, limit }: PaginationQuery) {

    const where = {
        studentId
    };

    return {};
}

