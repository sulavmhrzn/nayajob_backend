import dotenv from "dotenv";
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
};
