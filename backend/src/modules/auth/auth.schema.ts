import { z } from "zod";

const email = z.string().trim().toLowerCase().pipe(z.email("Enter a valid email address").max(254, "Email is too long"));


export const registerSchema = z.object({

    name: z.string().trim().min(2, "Name must be at least 2 characters").max(80, "Name is too long"),
    email,

    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(72, "Password must be at most 72 characters") // bcrypt only uses the first 72 bytes
        .regex(/[a-z]/, "Password needs a lowercase letter")
        .regex(/[A-Z]/, "Password needs an uppercase letter")
        .regex(/[0-9]/, "Password needs a number"),
});


// NOTE: `role` is deliberately NOT accepted - public signup can only ever create STUDENTs.

export const loginSchema = z.object({
    email,
    password: z.string().min(1, "Password is required").max(72),

});


export const refreshSchema = z.object({

    refreshToken: z.string().min(1, "Refresh token is required"),

});



export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RefreshInput = z.infer<typeof refreshSchema>;