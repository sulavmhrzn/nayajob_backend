import type { NextFunction, Request, Response } from "express";
import { Envelope } from "../utils/envelope.ts";

export const hasRole = (role: "SEEKER" | "EMPLOYER") => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (req.user && req.user.role === role) {
            return next();
        }
        const envelope = Envelope.error(
            "Forbidden",
            "You do not have permission to access this resource"
        );
        res.status(403).json(envelope);
        return;
    };
};
