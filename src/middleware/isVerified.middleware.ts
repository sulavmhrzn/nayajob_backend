import type { NextFunction, Request, Response } from "express";

export const isVerified = (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    if (!req.user.isVerified) {
        res.status(403).json({ message: "Account not verified" });
        return;
    }
    next();
};
