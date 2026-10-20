import app from "./app.js";
import { env } from "./config/env.js";


async function startServer() {
    try {


        const server = app.listen(env.PORT, () => {
            console.log(
                `Review Dashboard API running on port ${env.PORT}`
            );
        });

        const shutdown = (signal: string) => {
            console.log(`${signal} received. Shutting down...`);


        };

    }


    catch (error) {
        console.error("Failed to start the server:", error);

        process.exit(1);
    }
}

void startServer();