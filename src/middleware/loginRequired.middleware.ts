import type { NextFunction, Request, Response } from "express";
import type { UserPayload } from "../types/user.ts";
import { verifyJWTToken } from "../utils/auth.ts";
import { Envelope } from "../utils/envelope.ts";

export const loginRequired = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const authorization = req.headers.authorization;
    if (!authorization) {
        res.status(401).json(
            Envelope.error("unauthorized", "missing authorization header")
        );
        return;
    }
    const token = authorization.split(" ");
    if (token.length !== 2 || token[0] !== "Bearer") {
        res.status(401).json(
            Envelope.error("unauthorized", "invalid authorization header")
        );
        return;
    }
    const recievedToken = token[1];
    const decodedToken = verifyJWTToken(recievedToken);
    if (!decodedToken.success) {
        res.status(401).json(
            Envelope.error("unauthorized", decodedToken.error)
        );
        return;
    }
    req.log.info(decodedToken, "user authenticated successfully");
    const { id, role, email, isVerified } = decodedToken.payload as UserPayload;
    req.user = {
        id,
        email,
        role,
        isVerified,
    };
    next();
};
