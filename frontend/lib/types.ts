export type Role = "STUDENT" | "MENTOR";
export type SubmissionStatus = "PENDING" | "APPROVED" | "REJECTED";

export type User = { id: string; name: string; email: string; role: Role; createdAt: string };

export type FeedbackEntry = {
    id: string;
    decision: SubmissionStatus;
    comment: string | null;
    createdAt: string;
    mentor: { name: string };
};

export type Submission = {
    id: string;
    projectName: string;
    repoUrl: string;
    liveUrl: string;
    description: string;
    status: SubmissionStatus;
    createdAt: string;
    reviewedAt: string | null;
    student?: { id: string; name: string; email: string };
    feedbacks: FeedbackEntry[];
};

export type PaginationMeta = { page: number; limit: number; total: number; totalPages: number };
export type Paginated<T> = { items: T[]; meta: PaginationMeta };
export type ReviewStats = { total: number; pending: number; approved: number; rejected: number };

export type AuthTokens = {
    accessToken: string;
    refreshToken: string;
    accessTokenExpiresIn: number;
    refreshTokenExpiresIn: number;
};

/** Shape every server action returns - plain data, never throws to the client. */
export type ActionResult<T = undefined> =
    | { ok: true; data: T }
    | { ok: false; message: string; fieldErrors?: Record<string, string>; status?: number };