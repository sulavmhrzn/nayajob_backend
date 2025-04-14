import rateLimit from "express-rate-limit";
import { ServerConfig } from "../utils/config.ts";

export const rateLimiter = rateLimit({
    windowMs: ServerConfig.rateLimit.windowMs || 15 * 60 * 1000,
    limit: ServerConfig.rateLimit.maxRequests || 100,
    message: "Too many requests from this IP, please try again later.",
    standardHeaders: true,
    legacyHeaders: false,
});
