import bcrypt from "bcryptjs";
import { env } from "../config/env.js";

export const hashPassword = (plain: string) => bcrypt.hash(plain, env.BCRYPT_ROUNDS);

export const verifyPassword = (plain: string, hash: string) => bcrypt.compare(plain, hash);

// Used to keep login timing constant when the email does not exist (avoids user enumeration).
export const DUMMY_HASH = bcrypt.hashSync("not-a-real-password", env.BCRYPT_ROUNDS);