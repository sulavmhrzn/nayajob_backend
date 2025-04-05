import type { Request, Response } from "express";
import { z } from "zod";
import {
    CreateEducationSchemaRefined,
    type CreateEducationSchemaType,
    CreateExperienceSchema,
    UpdateEducationSchema,
    UpdateSeekerProfileSchema,
    type UpdateSeekerProfileSchemaType,
} from "../schema/profile.schema.ts";
import {
    addSeekerEducationDB,
    addSeekerExperienceDB,
    deleteEducationDB,
    getSeekerProfileByUserId,
    updateEducationDB,
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

export const getSeekerEducation = async (req: Request, res: Response) => {
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
        "seeker education fetched successfully",
        profile.education
    );
    res.json(envelope);
};

export const addSeekerEducation = async (
    req: Request<any, any, CreateEducationSchemaType>,
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
    const parsed = CreateEducationSchemaRefined.safeParse(req.body);
    if (!parsed.success) {
        const error = prettyZodError(parsed.error);
        const envelope = Envelope.error("validation failed", error);
        res.status(400).json(envelope);
        return;
    }
    const data = await addSeekerEducationDB(req.user.id, {
        ...parsed.data,
        startDate: new Date(parsed.data.startDate),
        endDate: parsed.data.endDate ? new Date(parsed.data.endDate) : null,
    });
    if (!data.success) {
        const envelope = Envelope.error(data.error);
        res.status(500).json(envelope);
        return;
    }
    const envelope = Envelope.success(
        "seeker education added successfully",
        data
    );
    res.status(201).json(envelope);
};

export const deleteSeekerEducation = async (req: Request, res: Response) => {
    const { educationId } = req.params;
    const validNumber = z.number().safeParse(Number(educationId));
    if (!validNumber.success) {
        const envelope = Envelope.error("educationId is not a number");
        res.status(400).json(envelope);
        return;
    }
    const user = req.user;
    if (!user) {
        const envelope = Envelope.error("user not found");
        res.status(404).json(envelope);
        return;
    }
    const profile = await getSeekerProfileByUserId(user.id);
    if (!profile) {
        const envelope = Envelope.error("seeker profile not found");
        res.status(404).json(envelope);
        return;
    }
    const deleted = await deleteEducationDB(profile.id, validNumber.data);
    if (!deleted.success) {
        const envelope = Envelope.error(deleted.error);
        res.status(deleted.status).json(envelope);
        return;
    }
    const envelope = Envelope.success(
        "seeker education deleted successfully",
        deleted.data
    );
    res.status(deleted.status).json(envelope);
};

export const updateSeekerEducation = async (
    req: Request<{ educationId: string }, any, UpdateSeekerProfileSchemaType>,
    res: Response
) => {
    const { educationId } = req.params;
    const validEducationId = z.number().safeParse(Number(educationId));
    if (!validEducationId.success) {
        res.status(400).json(Envelope.error("educationId is not a number"));
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
    const parsed = UpdateEducationSchema.safeParse(req.body);
    if (!parsed.success) {
        const error = prettyZodError(parsed.error);
        res.status(400).json(Envelope.error("validation failed", error));
        return;
    }
    if (!parsed.data) {
        res.status(400).json(Envelope.error("validation failed"));
        return;
    }

    const updated = await updateEducationDB(profile.id, validEducationId.data, {
        ...parsed.data,
        startDate: parsed.data.startDate && new Date(parsed.data.startDate),
        endDate: parsed.data.endDate && new Date(parsed.data.endDate),
    });
    if (!updated.success) {
        res.status(updated.status).json(Envelope.error(updated.error));
        return;
    }
    res.status(200).json(
        Envelope.success("seeker education updated successfully", updated.data)
    );
};

export const getSeekerExperience = async (req: Request, res: Response) => {
    res.json({});
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
