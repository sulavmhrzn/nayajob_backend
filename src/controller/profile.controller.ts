import type { Request, Response } from "express";
import { getSeekerProfileByUserId } from "../service/user.ts";
import { Envelope } from "../utils/envelope.ts";
import { snakeCaseKeys } from "../utils/general.ts";

export const getSeekerProfile = async (req: Request, res: Response) => {
    const profile = await getSeekerProfileByUserId(req.user!.id);
    if (!profile) {
        const envelope = Envelope.error("seeker profile not found");
        res.status(404).json(envelope);
        return;
    }
    const snakeCaseProfile = snakeCaseKeys(profile);
    const snakeCaseUser = snakeCaseKeys(profile.user);
    const envelope = Envelope.success("seeker profile fetched successfully", {
        ...snakeCaseProfile,
        user: { ...snakeCaseUser },
    });
    res.json(envelope);
};
