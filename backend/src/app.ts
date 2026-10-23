import cors from "cors";
import express from "express";

import helmet from "helmet";
import { env } from "./config/env.js";

import { errorHandler } from "./middlewares/errorHandler.js";

import { notFound } from "./middlewares/notFound.js";

import { globalLimiter } from "./middlewares/rateLimiters.js";

import { authRouter } from "./modules/auth/auth.routes.js";

import { reviewsRouter } from "./modules/reviews/reviews.routes.js";

import { submissionsRouter } from "./modules/submissions/submissions.routes.js";



export const app = express();

app.set("trust proxy", env.TRUST_PROXY);
app.use(helmet());


app.use(cors({ origin: env.corsOrigins, credentials: true }));

app.use(globalLimiter);
app.use(express.json({ limit: "20kb" }));


app.get("/health", (_req, res) => res.json({ success: true, data: { status: "ok" } }));


app.use("/api/v1/auth", authRouter);

app.use("/api/v1/submissions", submissionsRouter);

app.use("/api/v1/reviews", reviewsRouter);



app.use(notFound);
app.use(errorHandler);