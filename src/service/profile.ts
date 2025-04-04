import {
    type Education,
    Prisma,
    PrismaClient,
    type SeekerProfile,
} from "@prisma/client";
import {
    PrismaClientKnownRequestError,
    PrismaClientValidationError,
} from "@prisma/client/runtime/library";
import { logger } from "../utils/logger.ts";

const prisma = new PrismaClient({ log: ["error", "query"] });

/**
 * Create a new seeker profile in the database
 * @param id - The ID of the user to whom the profile belongs
 * @returns - The created seeker profile object
 */
export const createSeekerProfile = async (
    id: number
): Promise<
    { success: true; message: string } | { success: false; error: string }
> => {
    try {
        await prisma.seekerProfile.create({
            data: { userId: id },
        });
        return {
            success: true,
            message: "Seeker profile created successfully",
        };
    } catch (error: unknown) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2002") {
                return {
                    success: false,
                    error: "Seeker profile already exists",
                };
            }
        }
        return {
            success: false,
            error: "An unexpected error occurred",
        };
    }
};

/**
 * Get a seeker profile by user ID from the database
 * @param userId - The ID of the user whose profile is to be retrieved
 * @returns The seeker profile object or null if not found
 */
export const getSeekerProfileByUserId = async (userId: number) => {
    const seekerProfile = await prisma.seekerProfile.findUnique({
        relationLoadStrategy: "join",
        where: {
            userId: userId,
        },
        include: {
            user: {
                select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    role: true,
                },
            },
            skills: {
                select: {
                    id: true,
                    name: true,
                },
            },
            experience: {
                select: {
                    id: true,
                    jobTitle: true,
                    companyName: true,
                    startDate: true,
                    endDate: true,
                    description: true,
                },
            },
            education: {
                select: {
                    id: true,
                    degree: true,
                    institution: true,
                    startDate: true,
                    endDate: true,
                    fieldOfStudy: true,
                },
            },
        },
    });
    return seekerProfile;
};

/**
 * Update a seeker's profile in the database
 * @param userId - The ID of the user whose profile is to be updated
 * @param data - The data to update the seeker profile with
 * @returns The updated seeker profile object or an error message
 */
export const updateSeekerProfileDB = async (
    userId: number,
    data: Prisma.SeekerProfileUpdateInput
): Promise<
    | {
          success: true;
          data: SeekerProfile;
      }
    | { success: false; error: string }
> => {
    try {
        const seekerProfile = await prisma.seekerProfile.update({
            where: {
                userId: userId,
            },
            data: data,
        });
        return { success: true, data: seekerProfile };
    } catch (error: unknown) {
        if (error instanceof PrismaClientKnownRequestError) {
            if (error.code === "P2002") {
                return {
                    success: false,
                    error: "Seeker profile already exists",
                };
            }
        }
        logger.error("Error updating seeker profile", error);
        return {
            success: false,
            error: "An unexpected error occurred",
        };
    }
};

/**
 * Create a new education entry for a seeker in the database
 * @param userID - The ID of the user to whom the education entry belongs
 * @param data - The education data to be added
 * @returns - The updated list of education entries for the seeker
 */
export const addSeekerEducationDB = async (
    userID: number,
    data: Prisma.EducationCreateInput
): Promise<
    { success: true; data: Education[] } | { success: false; error: string }
> => {
    try {
        const profile = await prisma.seekerProfile.update({
            where: {
                userId: userID,
            },
            data: { education: { create: data } },
            include: {
                education: true,
            },
        });
        return { success: true, data: profile.education };
    } catch (error: unknown) {
        logger.error("Error adding seeker education", error);
        if (error instanceof PrismaClientValidationError) {
            return {
                success: false,
                error: "Invalid data provided",
            };
        }
        return {
            success: false,
            error: "An unexpected error occurred",
        };
    }
};
