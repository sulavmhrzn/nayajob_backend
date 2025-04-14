import cloudinary from "cloudinary";
import dotenv from "dotenv";
import express from "express";
import { pinoHttp } from "pino-http";
import { NotFound } from "./middleware/NotFound.middleware.ts";
import { rateLimiter } from "./middleware/rateLimiter.middleware.ts";
import {
    authRouter,
    employerProfileRouter,
    healthCheckRouter,
    jobRouter,
    seekerProfileRouter,
} from "./routes/index.ts";
import { ServerConfig, pinoHttpLoggerConfig } from "./utils/config.ts";
import { checkEnvironmentVariables } from "./utils/general.ts";
import { logger } from "./utils/logger.ts";

dotenv.config();

const app = express();

app.use(express.json());
app.use(pinoHttp(pinoHttpLoggerConfig));
app.use(rateLimiter);

app.use("/api/health-check", healthCheckRouter);
app.use("/api/auth", authRouter);
app.use("/api/profile/seeker-profile", seekerProfileRouter);
app.use("/api/profile/employer-profile", employerProfileRouter);
app.use("/api/jobs", jobRouter);
app.use(NotFound);

cloudinary.v2.config({
    cloud_name: ServerConfig.cloudinary.cloudName,
    api_key: ServerConfig.cloudinary.apiKey,
    api_secret: ServerConfig.cloudinary.apiSecret,
});

app.listen(ServerConfig.port, () => {
    logger.info(`Server is running on port ${ServerConfig.port}`);
    logger.info(
        `Rate limit window: ${ServerConfig.rateLimit.windowMs} ms, max requests: ${ServerConfig.rateLimit.maxRequests}`
    );
    checkEnvironmentVariables();
});
