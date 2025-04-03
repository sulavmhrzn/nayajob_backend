import type { NextFunction, Request, Response } from "express";

export const NotFound = (req: Request, res: Response, next: NextFunction) => {
    res.status(404).json({
        message: "Not Found",
    });
};
