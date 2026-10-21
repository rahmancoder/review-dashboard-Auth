import { Router } from "express";

import rateLimit from "express-rate-limit";

import { authenticate } from "../../middlewares/authenticate.js";



const router = Router();

const authLimiter = rateLimit({

    windowMs: 15 * 60 * 1000,
    limit: 10,

    standardHeaders: true,

    legacyHeaders: false,

    message: {
        success: false,
        message: "Too many authentication attempts. Try again later."
    }

});

router.post(
    "/register",


);

router.post(
    "/login",

);

router.post("/refresh",);

router.post("/logout",

);

router.get("/me",

    authenticate,
);

export default router;