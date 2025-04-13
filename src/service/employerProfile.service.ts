import type { EmployerProfile, Prisma, User } from "@prisma/client";
import {
    PrismaClientKnownRequestError,
    PrismaClientValidationError,
} from "@prisma/client/runtime/library";
import { logger } from "../utils/logger.ts";
import { prisma } from "./db.ts";

/**
 * Create an employer profile
 * @param user - The user object containing user information
 * @returns - The status and result of the creation operation
 */
export const createEmployerProfile = async (
    user: User,
    { companyName }: { companyName: string }
): Promise<
    | { status: number; success: true; data: EmployerProfile }
    | { status: number; success: false; error: string }
> => {
    try {
        const profile = await prisma.employerProfile.create({
            data: {
                userId: user.id,
                companyName: companyName,
                companyDescription: "No description",
                companyLogo: "No logo",
                companyWebsite: "No website",
                companyLocation: "No location",
                companySize: "SMALL",
                companyIndustryType: "TECHNOLOGY",
                companyType: "CORPORATE",
            },
        });
        return { status: 201, success: true, data: profile };
    } catch (error: unknown) {
        logger.error("Error creating employer profile", error);
        if (error instanceof PrismaClientKnownRequestError) {
            if (error.code === "P2002") {
                return {
                    status: 409,
                    success: false,
                    error: "Employer profile already exists",
                };
            }
        }
        return {
            status: 500,
            success: false,
            error: "An unexpected error occurred",
        };
    }
};

/**
 * Get an employer profile by user ID
 * @param userId - The ID of the user
 * @returns - The status and result of the retrieval operation
 */
export const getEmployerProfileByUserId = async (
    userId: number
): Promise<
    | { status: number; success: true; data: EmployerProfile }
    | { status: number; success: false; error: string }
> => {
    try {
        const profile = await prisma.employerProfile.findUnique({
            where: {
                userId: userId,
            },
        });
        if (!profile) {
            return {
                status: 404,
                success: false,
                error: "Employer profile not found",
            };
        }
        return {
            status: 200,
            success: true,
            data: profile,
        };
    } catch (error: unknown) {
        logger.error("Error fetching employer profile", error);
        return {
            status: 500,
            success: false,
            error: "An unexpected error occurred",
        };
    }
};

/**
 * Update an employer profile
 * @param userId - The ID of the user
 * @param data - The data to update in the employer profile
 * @returns - The status and result of the update operation
 */
export const updateEmployerProfileDB = async (
    userId: number,
    data: Prisma.EmployerProfileUpdateInput
): Promise<
    | { status: number; success: true; data: EmployerProfile }
    | { status: number; success: false; error: string }
> => {
    try {
        const profile = await prisma.employerProfile.update({
            where: {
                userId: userId,
            },
            data: data,
        });
        return {
            status: 200,
            success: true,
            data: profile,
        };
    } catch (error: unknown) {
        logger.error("Error updating employer profile", error);
        if (error instanceof PrismaClientValidationError) {
            return {
                status: 400,
                success: false,
                error: "Validation error",
            };
        }
        return {
            status: 500,
            success: false,
            error: "An unexpected error occurred",
        };
    }
};
