import cloudinary from "cloudinary";

import { snakeCase } from "change-case";
import { isValidPhoneNumber } from "libphonenumber-js";
import { type ZodError, z } from "zod";
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
