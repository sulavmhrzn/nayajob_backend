import argon2 from "argon2";
import jwt, { type JwtPayload } from "jsonwebtoken";
import type { StringValue } from "ms";
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
    payload: Record<string, string | number | boolean>,
    opts?: { jwtExpiresIn?: StringValue }
): string => {
    const token = jwt.sign(payload, ServerConfig.jwt.secret, {
        expiresIn: opts?.jwtExpiresIn
            ? opts.jwtExpiresIn
            : ServerConfig.jwt.expiresIn,
    });
    return token;
};

/**
 * Verifies a JWT token and returns the payload.
 * @param token - The JWT token to verify.
 * @returns An object containing the success status and the payload or an error message.
 */
export const verifyJWTToken = (
    token: string
):
    | { success: true; payload: string | JwtPayload }
    | { success: false; error: string } => {
    try {
        const payload = jwt.verify(token, ServerConfig.jwt.secret);
        return { success: true, payload };
    } catch (error: unknown) {
        if (error instanceof jwt.JsonWebTokenError) {
            return {
                success: false,
                error: error.message,
            };
        }
        if (error instanceof jwt.TokenExpiredError) {
            return {
                success: false,
                error: "Token expired",
            };
        }
        throw error;
    }
};
