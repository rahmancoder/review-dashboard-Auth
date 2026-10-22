import cors from "cors";
import express from "express";
import { env } from "./config/env.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { notFound } from "./middlewares/notFound.js";

import { authRouter } from "./modules/auth/auth.routes.js";

export const app = express();


app.use(cors({ origin: env.corsOrigins, credentials: true }));


app.get("/health", (_req, res) => res.json({ success: true, data: { status: "ok" } }));



app.use("/api/v1/auth", authRouter);

// app.use("/api/v1/submissions", submissionsRouter);
// app.use("/api/v1/reviews", reviewsRouter);

app.use(notFound);
app.use(errorHandler);