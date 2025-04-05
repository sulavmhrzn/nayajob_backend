import type { Request, Response } from "express";
import { z } from "zod";
import { CreateExperienceSchema } from "../../schema/profile.schema.ts";
import {
    addSeekerExperienceDB,
    deleteSeekerExperienceDB,
    getSeekerExperienceDB,
    getSeekerProfileByUserId,
} from "../../service/profile.service.ts";
import { Envelope } from "../../utils/envelope.ts";
import { prettyZodError } from "../../utils/general.ts";

export const getSeekerExperience = async (req: Request, res: Response) => {
    const user = req.user;
    if (!user) {
        const envelope = Envelope.error("user not found");
        res.status(404).json(envelope);
        return;
    }
    const experience = await getSeekerExperienceDB(user.id);
    if (!experience.success) {
        const envelope = Envelope.error(experience.error);
        res.status(experience.status).json(envelope);
        return;
    }
    const envelope = Envelope.success(
        "seeker experience fetched successfully",
        experience.data
    );
    res.status(200).json(envelope);
};

export const addSeekerExperience = async (req: Request, res: Response) => {
    const user = req.user;
    if (!user) {
        const envelope = Envelope.error("user not found");
        res.status(404).json(envelope);
        return;
    }
    const parsed = CreateExperienceSchema.safeParse(req.body);
    if (!parsed.success) {
        const error = prettyZodError(parsed.error);
        const envelope = Envelope.error("validation failed", error);
        res.status(400).json(envelope);
        return;
    }
    const inserted = await addSeekerExperienceDB(user.id, {
        ...parsed.data,
        startDate: new Date(parsed.data.startDate),
        endDate: parsed.data.endDate ? new Date(parsed.data.endDate) : null,
    });
    if (!inserted.success) {
        const envelope = Envelope.error(inserted.error);
        res.status(inserted.status).json(envelope);
        return;
    }
    const envelope = Envelope.success(
        "seeker experience added successfully",
        inserted.data
    );
    res.status(201).json(envelope);
};

export const deleteSeekerExperience = async (
    req: Request<{ experienceId: string }>,
    res: Response
) => {
    const { experienceId } = req.params;
    const validExperienceId = z.number().safeParse(Number(experienceId));
    if (!validExperienceId.success) {
        res.status(400).json(Envelope.error("experienceId is not a number"));
        return;
    }
    const user = req.user;
    if (!user) {
        res.status(404).json(Envelope.error("user not found"));
        return;
    }
    const profile = await getSeekerProfileByUserId(user.id);
    if (!profile) {
        res.status(404).json(Envelope.error("seeker profile not found"));
        return;
    }
    const deleted = await deleteSeekerExperienceDB(
        profile.id,
        validExperienceId.data
    );
    if (!deleted.success) {
        res.status(deleted.status).json(Envelope.error(deleted.error));
        return;
    }
    const envelope = Envelope.success(
        "seeker experience deleted successfully",
        deleted.data
    );
    res.status(deleted.status).json(envelope);
};
