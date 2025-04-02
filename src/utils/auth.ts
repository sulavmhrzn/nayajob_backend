import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { ServerConfig } from "./config.ts";

type SuccessHashResponse = {
    success: true;
    hash: string;
};

type ErrorHashResponse = {
    success: false;
    error: string;
};
type HashResponse = SuccessHashResponse | ErrorHashResponse;

/**
 * Hashes a password using argon2.
 * @param password - The password to hash.
 * @returns A promise that resolves to an object containing the success status and the hashed password or an error message.
 */
export const hashPassword = async (password: string): Promise<HashResponse> => {
    try {
        const hashedPassword = await argon2.hash(password);
        return { success: true, hash: hashedPassword };
    } catch (error: unknown) {
        if (error instanceof Error) {
            return {
                success: false,
                error: `Error hashing password: ${error.message}`,
            };
        }
        return { success: false, error: "Unknown error occurred" };
    }
};

/**
 * Verifies a password against a hashed password using argon2.
 * @param hashedPassword - The hashed password to verify against.
 * @param password - The password to verify.
 * @returns A promise that resolves to a boolean indicating whether the password matches the hashed password.
 */
export const verifyPassword = async (
    hashedPassword: string,
    password: string
): Promise<boolean> => {
    try {
        const isMatch = await argon2.verify(hashedPassword, password);
        return isMatch;
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(`Error verifying password: ${error.message}`);
        }
        throw new Error("Unknown error occurred");
    }
};

/**
 * Generates a JWT token for a user.
 * @param payload - The payload to include in the token.
 * @returns The generated JWT token.
 */
export const generateJWTToken = (
    payload: Record<string, string | number | boolean>
): string => {
    const token = jwt.sign(payload, ServerConfig.jwt.secret, {
        expiresIn: ServerConfig.jwt.expiresIn,
    });
    return token;
};
