import { z } from "zod";

const ALLOWED_REPO_HOSTS = ["github.com", "gitlab.com", "bitbucket.org"];


const httpUrl = (label: string) =>
    z
        .string()
        .trim()
        .min(1, `${label} is required`)
        .max(300, `${label} is too long`)
        .refine((v) => {
            try {
                return ["http:", "https:"].includes(new URL(v).protocol);
            } catch {
                return false;
            }
        }, `${label} must be a valid http(s) URL`);


export const createSubmissionSchema = z.object({

    projectName: z.string().trim().min(3, "Project name must be at least 3 characters").max(80, "Project name is too long"),


    repoUrl: httpUrl("Repository URL")
        .refine((v) => new URL(v).protocol === "https:", "Repository URL must use https")
        .refine((v) => {
            const host = new URL(v).hostname.toLowerCase().replace(/^www\./, "");
            return ALLOWED_REPO_HOSTS.includes(host);
        }, `Repository must be hosted on ${ALLOWED_REPO_HOSTS.join(", ")}`)
        .refine(
            (v) => new URL(v).pathname.replace(/\/+$/, "").split("/").filter(Boolean).length >= 2,
            "Repository URL must look like https://github.com/owner/repo",
        ),

    liveUrl: httpUrl("Live link"),

    description: z
        .string()
        .trim()
        .min(20, "Description must be at least 20 characters")
        .max(1000, "Description must be at most 1000 characters"),
});


export const paginationQuery = z.object({

    page: z.coerce.number().int().min(1).default(1),

    limit: z.coerce.number().int().min(1).max(50).default(10),
});


export const idParamSchema = z.object({ id: z.uuid("Invalid id") });


export type CreateSubmissionInput = z.infer<typeof createSubmissionSchema>;
export type PaginationQuery = z.infer<typeof paginationQuery>;