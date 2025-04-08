import { type EmployerProfile, PrismaClient, type User } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { logger } from "../utils/logger.ts";

const prisma = new PrismaClient({ log: ["error", "query"] });

/**
 * Create an employer profile
 * @param user - The user object containing user information
 * @returns - The status and result of the creation operation
 */
export const createEmployerProfile = async (
    user: User
): Promise<
    | { status: number; success: true; data: EmployerProfile }
    | { status: number; success: false; error: string }
> => {
    try {
        const profile = await prisma.employerProfile.create({
            data: {
                userId: user.id,
                companyName: `${user.firstName}'s Company`,
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
