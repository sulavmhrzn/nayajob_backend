import dotenv from "dotenv";
import express from "express";
import pinoHttp from "pino-http";
import { authRouter, healthCheckRouter } from "./routes/index.ts";
import { ServerConfig, pinoHttpLoggerConfig } from "./utils/config.ts";
import { logger } from "./utils/logger.ts";

dotenv.config();

const app = express();

app.use(express.json());
app.use(pinoHttp(pinoHttpLoggerConfig));

app.use("/api/health-check", healthCheckRouter);
app.use("/api/auth", authRouter);

const port = process.env.PORT ? Number(process.env.PORT) : ServerConfig.port;
app.listen(port, () => {
    logger.info(`Server is running on port ${port}`);
});
