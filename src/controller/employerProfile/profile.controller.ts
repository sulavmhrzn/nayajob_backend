import type { Request, Response } from "express";
import { getEmployerProfileByUserId } from "../../service/employerProfile.service.ts";
import { Envelope } from "../../utils/envelope.ts";

export const getEmployerProfile = async (req: Request, res: Response) => {
    const user = req.user;
    if (!user) {
        res.status(401).json({
            message: "Unauthorized",
        });
        return;
    }
    const profile = await getEmployerProfileByUserId(user?.id);
    if (!profile.success) {
        const envelope = Envelope.error(profile.error);
        res.status(profile.status).json(envelope);
        return;
    }
    res.json({
        message: "Employer profile fetched successfully",
        data: profile.data,
    });
};
