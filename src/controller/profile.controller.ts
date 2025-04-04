import type { Request, Response } from "express";
import {
    UpdateSeekerProfileSchema,
    type UpdateSeekerProfileSchemaType,
} from "../schema/profile.schema.ts";
import {
    getSeekerProfileByUserId,
    updateSeekerProfileDB,
} from "../service/profile.ts";
import { Envelope } from "../utils/envelope.ts";
import { prettyZodError } from "../utils/general.ts";

export const getSeekerProfile = async (req: Request, res: Response) => {
    if (!req.user) {
        const envelope = Envelope.error("user not found");
        res.status(404).json(envelope);
        return;
    }
    const profile = await getSeekerProfileByUserId(req.user.id);
    if (!profile) {
        const envelope = Envelope.error("seeker profile not found");
        res.status(404).json(envelope);
        return;
    }
    const envelope = Envelope.success(
        "seeker profile fetched successfully",
        profile
    );
    res.json(envelope);
};

export const updateSeekerProfile = async (
    req: Request<any, any, UpdateSeekerProfileSchemaType>,
    res: Response
) => {
    if (!req.user) {
        const envelope = Envelope.error("user not found");
        res.status(404).json(envelope);
        return;
    }
    const profile = await getSeekerProfileByUserId(req.user.id);
    if (!profile) {
        const envelope = Envelope.error("seeker profile not found");
        res.status(404).json(envelope);
        return;
    }
    const parsed = UpdateSeekerProfileSchema.safeParse(req.body);
    if (!parsed.success) {
        const error = prettyZodError(parsed.error);
        const envelope = Envelope.error("validation failed", error);
        res.status(400).json(envelope);
        return;
    }
    const updatedProfile = await updateSeekerProfileDB(
        req.user.id,
        parsed.data
    );
    if (!updatedProfile.success) {
        const envelope = Envelope.error("failed to update seeker profile");
        res.status(500).json(envelope);
        return;
    }
    const envelope = Envelope.success(
        "update seeker profile",
        updatedProfile.data
    );
    res.json(envelope);
};
