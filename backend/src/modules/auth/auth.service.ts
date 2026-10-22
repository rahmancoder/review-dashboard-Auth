import jwt from "jsonwebtoken";
import { prisma } from "../../lib/prisma.js";

import { DUMMY_HASH, hashPassword, verifyPassword } from "../../lib/password.js";

import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../../lib/jwt.js";
import { env } from "../../config/env.js";

import { AppError } from "../../utils/AppError.js";

import type { LoginInput, RegisterInput } from "./auth.schema.js";



const publicUser = {
    id: true,
    name: true,
    email: true,
    role: true,
    createdAt: true
} as const;



function issueTokens(
    user: {
        id: string;
        role: "STUDENT" | "MENTOR"
    }) {
    const payload = {
        sub: user.id,
        role: user.role
    };


    return {

        accessToken: signAccessToken(payload),
        refreshToken: signRefreshToken(payload),

        accessTokenExpiresIn: env.JWT_ACCESS_TTL_SECONDS,
        refreshTokenExpiresIn: env.JWT_REFRESH_TTL_SECONDS,
    };
}


export async function register(input: RegisterInput) {

    const exists = await prisma.user.findUnique({

        where: {
            email: input.email
        },

        select: {
            id: true
        }
    });


    if (exists) {

        throw AppError.conflict("An account with this email already exists", [
            { path: "email", message: "Email is already registered" },
        ]);

    }

    const user = await prisma.user.create({
        data: {
            name: input.name,
            email: input.email,
            passwordHash: await hashPassword(input.password),
            role: "STUDENT"
        },
        select: publicUser,

    });


    return { user, ...issueTokens(user) };

}

export async function login(input: LoginInput) {

    const user = await prisma.user.findUnique({ where: { email: input.email } });
    // Always run bcrypt so response time doesn't reveal whether the email exists.

    const ok = await verifyPassword(input.password, user?.passwordHash ?? DUMMY_HASH);

    if (!user || !ok) throw AppError.unauthorized("Invalid email or password");

    const { passwordHash: _omit, ...safe } = user;



    return { user: safe, ...issueTokens(user) };
}


export async function refresh(refreshToken: string) {

    let payload;

    try {
        payload = verifyRefreshToken(refreshToken);
    }

    catch (err) {
        throw AppError.unauthorized(
            err instanceof jwt.TokenExpiredError ? "Session expired, please log in again" : "Invalid refresh token",
        );
    }

    // Refresh is rare, so we can afford a DB read: picks up deleted users / role changes.
    const user = await prisma.user.findUnique({
        where: {
            id: payload.sub
        },
        select: publicUser
    });

    if (!user) throw AppError.unauthorized("Account no longer exists");

    return { user, ...issueTokens(user) };
}



export async function getMe(userId: string) {
    const user = await prisma.user.findUnique({
        where: {
            id: userId
        },
        select: publicUser
    });


    if (!user) throw AppError.unauthorized("Account no longer exists");

    return user;
}