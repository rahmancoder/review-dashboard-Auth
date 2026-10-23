import { z } from "zod";

/**
 * Client + server-action validation. These mirror the backend zod schemas
 * (the API remains the source of truth and re-validates everything).
 */

export const loginSchema = z.object({

  email: z.string().trim().min(1, "Email is required").pipe(z.email("Enter a valid email address")),

  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z
  .object({

    name: z.string().trim().min(2, "Name must be at least 2 characters").max(80, "Name is too long"),

    email: z.string().trim().min(1, "Email is required").pipe(z.email("Enter a valid email address")),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(72, "Password must be at most 72 characters")
      .regex(/[a-z]/, "Password needs a lowercase letter")
      .regex(/[A-Z]/, "Password needs an uppercase letter")
      .regex(/[0-9]/, "Password needs a number"),

    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((v) => v.password === v.confirmPassword, { path: ["confirmPassword"], message: "Passwords do not match" });




const ALLOWED_REPO_HOSTS = ["github.com", "gitlab.com", "bitbucket.org"];


const parse = (v: string) => {


  try {
    return new URL(v);
  }

  catch {
    return null;
  }

};



export const submissionSchema = z.object({

  projectName: z.string().trim().min(3, "Project name must be at least 3 characters").max(80, "Project name is too long"),

  repoUrl: z
    .string()
    .trim()
    .min(1, "Repository URL is required")
    .refine((v) => parse(v) !== null, "Enter a valid URL")
    .refine((v) => parse(v)?.protocol === "https:", "Repository URL must use https")
    .refine(
      (v) => ALLOWED_REPO_HOSTS.includes((parse(v)?.hostname ?? "").toLowerCase().replace(/^www\./, "")),
      `Repository must be hosted on ${ALLOWED_REPO_HOSTS.join(", ")}`,
    )
    .refine(
      (v) => (parse(v)?.pathname ?? "").split("/").filter(Boolean).length >= 2,
      "Use the full repo link, e.g. https://github.com/owner/repo",
    ),

  liveUrl: z
    .string()
    .trim()
    .min(1, "Live link is required")
    .refine((v) => ["http:", "https:"].includes(parse(v)?.protocol ?? ""), "Enter a valid http(s) URL"),

  description: z
    .string()
    .trim()
    .min(20, "Description must be at least 20 characters")
    .max(1000, "Description must be at most 1000 characters"),

});


export const rejectSchema = z.object({

  comment: z.string().trim().min(5, "Please give the student a reason (at least 5 characters)").max(1000),
});



export type LoginValues = z.infer<typeof loginSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;
export type SubmissionValues = z.infer<typeof submissionSchema>;
