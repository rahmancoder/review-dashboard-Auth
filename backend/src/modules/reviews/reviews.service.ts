import type { Prisma } from "../../generated/prisma/client.js";
import { prisma } from "../../lib/prisma.js";
import { AppError } from "../../utils/AppError.js";


import type { ListReviewsQuery, ReviewDecisionInput } from "./reviews.schema.js";




/** Server-side filtering + pagination for the mentor table. */
export async function listSubmissions({ page, limit, status, search }: ListReviewsQuery) {

    const where: Prisma.SubmissionWhereInput = {
        ...(status ? { status } : {}),
        ...(search
            ? {
                OR: [
                    { projectName: { contains: search, mode: "insensitive" } },
                    { student: { name: { contains: search, mode: "insensitive" } } },
                    { student: { email: { contains: search, mode: "insensitive" } } },
                ],
            }
            : {}),
    };



    const [items, total] = await prisma.$transaction([
        prisma.submission.findMany({
            where,
            orderBy: { createdAt: "desc" },
            skip: (page - 1) * limit,
            take: limit,
            include: {
                student: { select: { id: true, name: true, email: true } },
                feedbacks: {
                    orderBy: { createdAt: "desc" },
                    take: 1,
                    select: {
                        id: true,
                        decision: true,
                        comment: true,
                        createdAt: true,
                        mentor: { select: { name: true } }
                    },
                },
            },
        }),
        prisma.submission.count({ where }),
    ]);
    return { items, total };
}

/** Aggregated counts in one grouped query (not 4 separate COUNTs). */
export async function getStats() {

    const groups = await prisma.submission.groupBy({
        by: ["status"],
        _count: {
            _all: true
        }
    });
    const count = (s: string) => groups.find((g) => g.status === s)?._count._all ?? 0;

    const pending = count("PENDING");
    const approved = count("APPROVED");
    const rejected = count("REJECTED");

    return { total: pending + approved + rejected, pending, approved, rejected };
}

/**
 * Securing a route (Topic 2A) - the service half.
 * The route already proved (1) a valid JWT and (2) role === MENTOR from the token claim.
 * Here we make the access decision definitive using the DATABASE, never the token alone:
 *   a. the user id from the token must still exist AND still be a MENTOR (handles deleted / demoted users
 *      whose old token hasn't expired yet),
 *   b. the submission must exist,
 *   c. the status change is a compare-and-set (`WHERE status = 'PENDING'`) so two mentors clicking at once
 *      can't both "win" and a decided submission can't be silently overwritten,
 *   d. update + feedback row are written in ONE transaction.
 */
export async function reviewSubmission(mentorId: string, submissionId: string, input: ReviewDecisionInput) {

    return prisma.$transaction(async (tx) => {

        const mentor = await tx.user.findUnique({
            where: {
                id: mentorId
            },
            select: {
                role: true
            }
        });

        if (!mentor || mentor.role !== "MENTOR") throw AppError.forbidden("Only mentors can review submissions");

        const { count } = await tx.submission.updateMany({

            where: {
                id: submissionId,
                status: "PENDING"
            },

            data: {
                status: input.status,
                reviewerId: mentorId,
                reviewedAt: new Date()
            },
        });

        if (count === 0) {
            const exists = await tx.submission.findUnique({
                where: {
                    id: submissionId
                },
                select: {
                    status: true
                }
            });


            if (!exists) throw AppError.notFound("Submission not found");

            throw AppError.conflict(`This submission has already been ${exists.status.toLowerCase()}`);
        }

        await tx.feedback.create({
            data: { submissionId, mentorId, decision: input.status, comment: input.comment || null },
        });

        return tx.submission.findUniqueOrThrow({
            where: { id: submissionId },
            include: {
                student: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                feedbacks: {
                    orderBy: {
                        createdAt: "desc"
                    },
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
                    }
                },
            },
        });
    });
}