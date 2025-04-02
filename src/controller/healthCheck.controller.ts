import type { Request, Response } from "express";
import { Envelope } from "../utils/envelope.ts";

export const healthCheck = (req: Request, res: Response) => {
    const envelope = Envelope.success("Health check passed", {
        timestamp: new Date().toISOString(),
        status: "OK",
        message: "Server is running",
        info: {
            uptime: process.uptime(),
            memoryUsage: process.memoryUsage(),
        },
    });
    res.status(200).json(envelope);
};
