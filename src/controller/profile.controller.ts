import type { Request, Response } from "express";
import { z } from "zod";
import {
    CreateEducationSchema,
    type CreateEducationSchemaType,
    UpdateSeekerProfileSchema,
    type UpdateSeekerProfileSchemaType,
} from "../schema/profile.schema.ts";
import {
    addSeekerEducationDB,
    deleteEducationDB,
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
    const parsed = CreateEducationSchema.safeParse(req.body);
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
