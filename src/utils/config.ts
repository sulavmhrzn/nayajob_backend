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
};
