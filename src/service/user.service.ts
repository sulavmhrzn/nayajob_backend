import type { Prisma, User } from "@prisma/client";
import { PrismaClientValidationError } from "@prisma/client/runtime/library";
import { prisma } from "../service/db.ts";
import { logger } from "../utils/logger.ts";

type SuccessResponse<T> = {
    status: number;
    success: true;
    data: T;
};
type ErrorResponse = {
    status: number;
    success: false;
    error: string;
};
type Response<T> = SuccessResponse<T> | ErrorResponse;

/**
 * Get a user by email from the database
 * @param email - The email of the user to be retrieved
 * @returns The user object or null if not found
 */
export const getUserByEmail = async (
    email: string
): Promise<Response<User | null>> => {
    try {
        const user = await prisma.user.findUnique({
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                password: true,
                createdAt: true,
                updatedAt: true,
                isVerified: true,
            },
            where: { email },
        });
        if (!user) {
            return { status: 404, success: true, data: null };
        }
        return { status: 200, success: true, data: user };
    } catch (error: unknown) {
        logger.error("Error fetching user by email", error);
        if (error instanceof PrismaClientValidationError) {
            return { status: 400, success: false, error: "Validation failed" };
        }
        return { status: 500, success: false, error: "something went wrong" };
    }
};

/**
 * Create a new user in the database
 * @param userData - The user data to be created
 * @returns - The created user object
 */
export const createUser = async (
    userData: Prisma.UserCreateInput
): Promise<Response<User>> => {
    try {
        const user = await prisma.user.create({
            data: {
                email: userData.email,
                password: userData.password,
                firstName: userData.firstName,
                lastName: userData.lastName,
                role: userData.role,
            },
        });
        return { status: 201, success: true, data: user };
    } catch (error: unknown) {
        logger.error("Error creating user", error);
        if (error instanceof PrismaClientValidationError) {
            return { status: 400, success: false, error: "Validation failed" };
        }
        return { status: 500, success: false, error: "Unknown error occurred" };
    }
};

/**
 * Update a user by ID
 * @param id - The ID of the user to be updated
 * @param data - The data to update the user with
 * @returns - A Promise that resolves to the updated user object or an error message
 */
export const updateUserById = async (
    id: number,
    data: Prisma.UserUpdateInput
): Promise<Response<Omit<User, "password">>> => {
    try {
        const user = await prisma.user.update({
            where: { id },
            data,
            omit: { password: true },
        });
        return { status: 200, success: true, data: user };
    } catch (error: unknown) {
        logger.error("Error updating user", error);
        if (error instanceof Error) {
            return {
                status: 400,
                success: false,
                error: error.message,
            };
        }

        return {
            status: 500,
            success: false,
            error: "Unknown error occurred",
        };
    }
};
