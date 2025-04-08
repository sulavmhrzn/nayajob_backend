import {
    type Education,
    type Experience,
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
    | { status: number; success: true; message: string }
    | { status: number; success: false; error: string }
> => {
    try {
        await prisma.seekerProfile.create({
            data: { userId: id },
        });
        return {
            status: 201,
            success: true,
            message: "Seeker profile created successfully",
        };
    } catch (error: unknown) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2002") {
                return {
                    status: 409,
                    success: false,
                    error: "Seeker profile already exists",
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

/**
 * Delete an education entry for a seeker in the database
 * @param profileID - The ID of the profile from which the education entry will be deleted
 * @param educationId - The ID of the education entry to be deleted
 * @returns - The status and result of the deletion operation
 */
export const deleteSeekerEducationDB = async (
    profileID: number,
    educationId: number
): Promise<
    | { status: number; success: true; data: Education }
    | { status: number; success: false; error: string }
> => {
    try {
        const education = await prisma.education.delete({
            where: {
                id: educationId,
                seekerProfileId: profileID,
            },
        });
        return { status: 200, success: true, data: education };
    } catch (error: unknown) {
        logger.error(error, "Error deleting education entry");
        if (error instanceof PrismaClientKnownRequestError) {
            if (error.code === "P2025") {
                return {
                    status: 404,
                    success: false,
                    error: "Education entry not found",
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

export const updateSeekerEducationDB = async (
    profileId: number,
    educationId: number,
    data: Prisma.EducationUpdateInput
): Promise<
    | { status: number; success: true; data: Education }
    | { status: number; success: false; error: string }
> => {
    try {
        const updatedEducation = await prisma.education.update({
            where: {
                id: educationId,
                seekerProfileId: profileId,
            },
            data: data,
        });
        return { status: 200, success: true, data: updatedEducation };
    } catch (error: unknown) {
        logger.error(error, "Error updating education entry");
        if (error instanceof PrismaClientKnownRequestError) {
            if (error.code === "P2025") {
                return {
                    status: 404,
                    success: false,
                    error: "Education entry not found",
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
 * Add a new experience for a seeker
 * @param userID - The ID of the user adding the experience
 * @param data - The experience data to be added
 * @returns - The status and result of the addition operation
 */
export const addSeekerExperienceDB = async (
    userID: number,
    data: Prisma.ExperienceCreateInput
): Promise<
    | { status: number; success: true; data: Experience[] }
    | { status: number; success: false; error: string }
> => {
    try {
        const profile = await prisma.seekerProfile.update({
            where: {
                userId: userID,
            },
            data: {
                experience: {
                    create: data,
                },
            },
            include: {
                experience: true,
            },
        });
        return { status: 201, success: true, data: profile.experience };
    } catch (error: unknown) {
        logger.error(error, "Error adding seeker experience");
        if (error instanceof PrismaClientValidationError) {
            return {
                status: 400,
                success: false,
                error: "Invalid data provided",
            };
        }
        return {
            status: 500,
            success: false,
            error: "An unexpected error occurred",
        };
    }
};

/**
 * Delete an experience for a seeker
 * @param profileId - The ID of the user's profile
 * @param experienceId - The ID of the experience to be deleted
 * @returns - The status and result of the deletion operation
 */
export const deleteSeekerExperienceDB = async (
    profileId: number,
    experienceId: number
): Promise<
    | { status: number; success: true; data: Experience }
    | { status: number; success: false; error: string }
> => {
    try {
        const deleted = await prisma.experience.delete({
            where: {
                seekerProfileId: profileId,
                id: experienceId,
            },
        });
        return { status: 200, success: true, data: deleted };
    } catch (error: unknown) {
        logger.error(error, "Error deleting experience entry");
        if (error instanceof PrismaClientKnownRequestError) {
            if (error.code === "P2025") {
                return {
                    status: 404,
                    success: false,
                    error: "Experience entry not found",
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
 * Get the experience of a seeker
 * @param userId - The ID of the user whose experience is to be retrieved
 * @returns - The status and result of the retrieval operation
 */
export const getSeekerExperienceDB = async (
    userId: number
): Promise<
    | { status: number; success: true; data: Experience[] }
    | { status: number; success: false; error: string }
> => {
    try {
        const profile = await prisma.seekerProfile.findUnique({
            where: {
                userId: userId,
            },
            include: {
                experience: true,
            },
        });
        if (!profile) {
            return {
                status: 404,
                success: false,
                error: "Seeker profile not found",
            };
        }
        return { status: 200, success: true, data: profile.experience };
    } catch (error: unknown) {
        logger.error(error, "Error fetching experience");
        return {
            status: 500,
            success: false,
            error: "An unexpected error occurred",
        };
    }
};
