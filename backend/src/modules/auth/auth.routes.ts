import { Router } from "express";
import { authenticate } from "../../middlewares/authenticate.js";
import * as controller from "./auth.controller.js";
import { loginSchema, refreshSchema, registerSchema } from "./auth.schema.js";
import { validate } from "../../middlewares/validate.js";
import { authLimiter } from "../../middlewares/rateLimiters.js";

export const authRouter = Router();



authRouter.post("/register",

    authLimiter,
    validate({ body: registerSchema }),

    controller.register
);


authRouter.post("/login",

    authLimiter,
    validate({ body: loginSchema }),

    controller.login
);


authRouter.post("/refresh",

    authLimiter,
    validate({ body: refreshSchema }),
    controller.refresh
);


authRouter.get("/me",
    authenticate,
    controller.me
);