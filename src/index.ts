import dotenv from "dotenv";
import express from "express";
import pinoHttp from "pino-http";
import { NotFound } from "./middleware/NotFound.middleware.ts";
import {
    authRouter,
    healthCheckRouter,
    profileRouter,
} from "./routes/index.ts";
import { ServerConfig, pinoHttpLoggerConfig } from "./utils/config.ts";
import { logger } from "./utils/logger.ts";

dotenv.config();

const app = express();

app.use(express.json());
app.use(pinoHttp(pinoHttpLoggerConfig));

app.use("/api/health-check", healthCheckRouter);
app.use("/api/auth", authRouter);
app.use("/api/profile", profileRouter);
app.use(NotFound);

const port = process.env.PORT ? Number(process.env.PORT) : ServerConfig.port;
if (!process.env.JWT_SECRET) {
    logger.warn("JWT_SECRET is not set. Authentication will not work.");
}
app.listen(port, () => {
    logger.info(`Server is running on port ${port}`);
});
