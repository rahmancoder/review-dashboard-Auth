import "dotenv/config";
import { z } from "zod";


const envSchema = z.object({


    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),

    PORT: z.coerce.number().int().positive().default(5000),

    DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),

    CORS_ORIGINS: z.string().default("http://localhost:3000"),

    JWT_ACCESS_SECRET: z.string().min(32, "JWT_ACCESS_SECRET must be at least 32 characters"),
    JWT_REFRESH_SECRET: z.string().min(32, "JWT_REFRESH_SECRET must be at least 32 characters"),

    JWT_ACCESS_TTL_SECONDS: z.coerce.number().int().positive().default(3600),
    JWT_REFRESH_TTL_SECONDS: z.coerce.number().int().positive().default(604800),

    BCRYPT_ROUNDS: z.coerce.number().int().min(4).max(15).default(12),


});

const parsed = envSchema.safeParse(process.env);


if (!parsed.success) {

    console.error(" Invalid environment variables:");

    console.error(z.prettifyError(parsed.error));

    process.exit(1);
}


export const env = {
    ...parsed.data,

    isProd: parsed.data.NODE_ENV === "production",

    corsOrigins: parsed.data.CORS_ORIGINS.split(",").map((o) => o.trim()).filter(Boolean),
};