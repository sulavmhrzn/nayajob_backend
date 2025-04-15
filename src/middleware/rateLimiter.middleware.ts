import type { Request, Response } from "express";
import rateLimit from "express-rate-limit";
import { ServerConfig } from "../utils/config.ts";
import { Envelope } from "../utils/envelope.ts";

const rateLimitOptions = {
    message: (req: Request, res: Response) => {
        return res
            .status(429)
            .json(
                Envelope.error(
                    "rate limit exceeded",
                    "Too many requests, please try again later."
                )
            );
    },
    standardHeaders: true,
    legacyHeaders: false,
};

export const globalRateLimiter = rateLimit({
    windowMs: ServerConfig.rateLimit.global.windowMs,
    limit: ServerConfig.rateLimit.global.maxRequests,
    ...rateLimitOptions,
});

export const authLimiter = rateLimit({
    windowMs: ServerConfig.rateLimit.authentication.windowMs,
    limit: ServerConfig.rateLimit.authentication.maxRequests,
    ...rateLimitOptions,
});

export const jobLimiter = rateLimit({
    windowMs: ServerConfig.rateLimit.job.windowMs,
    limit: ServerConfig.rateLimit.job.maxRequests,
    ...rateLimitOptions,
});
