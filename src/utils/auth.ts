import argon2 from "argon2";

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
