import { snakeCase } from "change-case";
import { isValidPhoneNumber } from "libphonenumber-js";
import { type ZodError, z } from "zod";

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
