import { snakeCase } from "change-case";
import type { ZodError } from "zod";

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
