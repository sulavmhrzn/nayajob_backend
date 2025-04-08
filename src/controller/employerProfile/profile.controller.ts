import type { Request, Response } from "express";
import {
    UpdateEmployerProfileSchema,
    type UpdateEmployerProfileSchemaType,
} from "../../schema/profile.schema.ts";
import {
    getEmployerProfileByUserId,
    updateEmployerProfileDB,
} from "../../service/employerProfile.service.ts";
import { Envelope } from "../../utils/envelope.ts";
import {
    handleImageUploadToCloudinary,
    prettyZodError,
} from "../../utils/general.ts";
import { upload } from "../../utils/multer.ts";

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

export const updateEmployerProfile = async (
    req: Request<any, any, UpdateEmployerProfileSchemaType>,
    res: Response
) => {
    const user = req.user;
    if (!user) {
        res.status(401).json({
            message: "Unauthorized",
        });
        return;
    }
    const parsed = UpdateEmployerProfileSchema.safeParse(req.body);
    if (!parsed.success) {
        const error = prettyZodError(parsed.error);
        const envelope = Envelope.error("validation failed", error);
        res.status(400).json(envelope);
        return;
    }
    const updatedProfile = await updateEmployerProfileDB(user.id, parsed.data);
    if (!updatedProfile.success) {
        const envelope = Envelope.error(updatedProfile.error);
        res.status(updatedProfile.status).json(envelope);
        return;
    }

    res.json({
        message: "Employer profile fetched successfully",
        data: updatedProfile.data,
    });
};

export const updateEmployerCompanyLogo = async (
    req: Request,
    res: Response
) => {
    const user = req.user;
    if (!user) {
        const envelope = Envelope.error("Unauthorized");
        res.status(401).json(envelope);
        return;
    }
    const middleware = upload.single("companyLogo");
    middleware(req, res, async (err) => {
        req.log.error(err);
        if (err) {
            const envelope = Envelope.error("File upload failed", err.message);
            res.status(400).json(envelope);
            return;
        }
        if (!req.file) {
            const envelope = Envelope.error(
                "File upload failed",
                "No file provided"
            );
            res.status(400).json(envelope);
            return;
        }

        const b64 = Buffer.from(req.file.buffer).toString("base64");
        const dataURI = `data:${req.file.mimetype};base64,${b64}`;
        const cloudinaryResponse = await handleImageUploadToCloudinary(
            "company_logos",
            `logo_${user.id}`,
            dataURI
        );
        if (!cloudinaryResponse.success) {
            const envelope = Envelope.error(
                "File upload failed",
                cloudinaryResponse.error
            );
            res.status(400).json(envelope);
            return;
        }
        const { url } = cloudinaryResponse.data;
        const updatedProfile = await updateEmployerProfileDB(user.id, {
            companyLogo: url,
        });
        if (!updatedProfile.success) {
            const envelope = Envelope.error(updatedProfile.error);
            res.status(updatedProfile.status).json(envelope);
            return;
        }
        const envelope = Envelope.success(
            "Company logo updated successfully",
            updatedProfile.data
        );
        res.json(envelope);
    });
};
