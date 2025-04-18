import cloudinary from "cloudinary";
import dotenv from "dotenv";
import express from "express";
import { pinoHttp } from "pino-http";
import { NotFound } from "./middleware/NotFound.middleware.ts";
import { globalRateLimiter } from "./middleware/rateLimiter.middleware.ts";
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
checkEnvironmentVariables();

const app = express();

app.use(express.json());
app.use(pinoHttp(pinoHttpLoggerConfig));
app.use(globalRateLimiter);

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
        {
            global: {
                windowMs: ServerConfig.rateLimit.global.windowMs,
                maxRequests: ServerConfig.rateLimit.global.maxRequests,
            },
            authentication: {
                windowMs: ServerConfig.rateLimit.authentication.windowMs,
                maxRequests: ServerConfig.rateLimit.authentication.maxRequests,
            },
            job: {
                windowMs: ServerConfig.rateLimit.job.windowMs,
                maxRequests: ServerConfig.rateLimit.job.maxRequests,
            },
        },
        "Rate limit configuration"
    );
});
