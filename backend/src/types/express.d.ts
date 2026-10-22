import type { Role } from "../generated/prisma/enums.js";

declare global {
    namespace Express {
        interface Request {
            /** Set by `authenticate` after the JWT signature + expiry have been verified. */
            user?: { id: string; role: Role };


            /** Set by `validate` - zod-parsed (and coerced) body / query / params. */
            validated?: { body?: unknown; query?: unknown; params?: unknown };
        }
    }
}

export { };