import dotenv from "dotenv";
import type { StringValue } from "ms";
dotenv.config();

export const pinoHttpLoggerConfig = {
    transport: {
        target: "pino-pretty",
    },
} as const;

export const pinoLoggerConfig = {
    transport: {
        target: "pino-pretty",
    },
    level: "info",
} as const;

export const ServerConfig = {
    port: Number(process.env.PORT) || 8000,
    jwt: {
        secret: process.env.JWT_SECRET,
        expiresIn: (process.env.JWT_EXPIRES_IN as StringValue) || "1h",
    },
    databaseUrl: process.env.DATABASE_URL,
    cloudinary: {
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        apiKey: process.env.CLOUDINARY_API_KEY,
        apiSecret: process.env.CLOUDINARY_API_SECRET,
    },
    resend: {
        apiKey: process.env.RESEND_API_KEY,
        fromEmail: process.env.RESEND_FROM_EMAIL,
    },
    rateLimit: {
        windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 20 * 60 * 1000,
        maxRequests: Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
    },
};
