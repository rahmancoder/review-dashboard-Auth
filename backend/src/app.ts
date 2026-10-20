import express from "express";


const app = express();



app.use(
    express.urlencoded({
        extended: true,
        limit: "1mb"
    })
);



app.get("/api/health", (_req, res) => {
    res.status(200).json({
        success: true,
        message: "Review Dashboard API is running"
    });
});


export default app;