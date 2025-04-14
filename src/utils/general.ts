import type { EmployerProfile } from "@prisma/client";
import { snakeCase } from "change-case";
import cloudinary from "cloudinary";
import type { Request, Response } from "express";
import { isValidPhoneNumber } from "libphonenumber-js";
import { type ZodError, z } from "zod";
import { getEmployerProfileByUserId } from "../service/employerProfile.service.ts";
import type { UserPayload } from "../types/user.ts";
import { ServerConfig } from "./config.ts";
import { Envelope } from "./envelope.ts";
import { logger } from "./logger.ts";

/**
 * Convert object keys to snake_case. This does not convert nested objects.
 * @param obj - The object to convert
 * @returns A new object with snake_case keys
 */
export const snakeCaseKeys = <T>(obj: Record<string, T>) => {
    return Object.fromEntries(
        Object.entries(obj).map(([key, value]) => {
            return [snakeCase(key), value];
        })
    );
};

/**
 * Convert a ZodError to a more readable format
 * @param error - The ZodError object to convert
 * @returns
 */
export const prettyZodError = (error: ZodError) => {
    const errors: Record<string, string> = {};
    error.issues.map((issue) => {
        errors[issue.path[0]] = issue.message;
    });
    return errors;
};

export const zPhoneNumber = z
    .string()
    .optional()
    .transform((value, ctx) => {
        if (value) {
            const isValid = isValidPhoneNumber(value, {
                defaultCountry: "NP",
            });
            if (!isValid) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ["phone"],
                    message: "Invalid phone number",
                });
                return z.NEVER;
            }
            return value;
        }
    });

/**
 * Upload an image to Cloudinary
 * @param folderName Cloudinary folder name
 * @param public_id Cloudinary public id
 * @param dataURI Base64 encoded image data
 * @example
 * const response = await handleImageUploadToCloudinary("myFolder", "myImage", "data:image/png;base64,...");
 * @returns A promise that resolves to an object indicating success or failure
 */
export const handleImageUploadToCloudinary = async (
    folderName: string,
    public_id: string | number,
    dataURI: string
): Promise<
    | { success: true; data: cloudinary.UploadApiResponse }
    | { success: false; error: string }
> => {
    try {
        const cloudinaryResponse = await cloudinary.v2.uploader.upload(
            dataURI,
            {
                folder: folderName,
                public_id: `${public_id}`,
                overwrite: true,
                resource_type: "image",
            }
        );
        return { success: true, data: cloudinaryResponse };
    } catch (error: unknown) {
        logger.error("Error uploading image to Cloudinary", error);
        return { success: false, error: "Image upload failed" };
    }
};

/**
 * Parse a job id from a string or number to a number
 * @param id The id to parse
 * @returns An object containing success status and either the parsed id or an error
 */
export const parseJobId = (id: string | number) => {
    const parsedId = z.coerce
        .number({ message: "Invalid job id" })
        .safeParse(id);
    if (!parsedId.success) {
        return {
            success: false as const,
            error: prettyZodError(parsedId.error),
        };
    }
    return {
        success: true as const,
        data: parsedId.data,
    };
};

/**
 * Checks if the user is authenticated and if the employer profile exists.
 * @param req - The express request object.
 * @param res - The express response object.
 * @returns - An object containing the user and employer profile if they exist, or an error envelope if not.
 */
export const UserAndEmployerProfileExists = async (
    req: Request<any, any, any>,
    res: Response
): Promise<
    | {
          data: { user: UserPayload; profile: EmployerProfile };
          error: null;
      }
    | { data: null; error: { status: number; envelope: Envelope<unknown> } }
> => {
    if (!req.user) {
        const envelope = Envelope.error("Unauthorized");
        return { data: null, error: { status: 401, envelope } };
    }

    const profile = await getEmployerProfileByUserId(req.user.id);
    if (!profile.success) {
        const envelope = Envelope.error(
            "Failed to fetch employer profile",
            profile.error
        );
        return { data: null, error: { status: 500, envelope } };
    }
    return { data: { user: req.user, profile: profile.data }, error: null };
};

/**
 * Checks if the required environment variables are set. If not, it logs an error and exits the process.
 * @returns - void
 */
export const checkEnvironmentVariables = (): void => {
    logger.info("Checking environment variables...");
    if (!process.env.DATABASE_URL) {
        logger.error("DATABASE_URL is not set. Exiting...");
        process.exit(1);
    }
    if (!process.env.CLOUDINARY_CLOUD_NAME) {
        logger.error("CLOUDINARY_CLOUD_NAME is not set. Exiting...");
        process.exit(1);
    }
    if (!process.env.CLOUDINARY_API_KEY) {
        logger.error("CLOUDINARY_API_KEY is not set. Exiting...");
        process.exit(1);
    }
    if (!process.env.CLOUDINARY_API_SECRET) {
        logger.error("CLOUDINARY_API_SECRET is not set. Exiting...");
        process.exit(1);
    }
    if (!process.env.RESEND_API_KEY) {
        logger.error("RESEND_API_KEY is not set. Exiting...");
        process.exit(1);
    }
    if (!process.env.RESEND_FROM_EMAIL) {
        logger.error("RESEND_FROM_EMAIL is not set. Exiting...");
        process.exit(1);
    }
    if (!process.env.JWT_SECRET) {
        logger.warn("JWT_SECRET is not set. Authentication will not work.");
    }
    if (!process.env.RATE_LIMIT_WINDOW_MS) {
        logger.warn(
            `RATE_LIMIT_WINDOW_MS is not set. Using default value ${ServerConfig.rateLimit.windowMs}.`
        );
    }
    if (!process.env.RATE_LIMIT_MAX_REQUESTS) {
        logger.warn(
            `RATE_LIMIT_MAX_REQUESTS is not set. Using default value ${ServerConfig.rateLimit.maxRequests}.`
        );
    }
};
