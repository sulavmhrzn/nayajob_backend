import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({ log: ["error", "query"] });

/**
 * Get a user by email from the database
 * @param email - The email of the user to be retrieved
 * @returns The user object or null if not found
 */
export const getUserByEmail = async (email: string) => {
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
        },
        where: { email },
    });
    return user;
};

/**
 * Create a new user in the database
 * @param userData - The user data to be created
 * @returns - The created user object
 */
export const createUser = async (userData: Prisma.UserCreateInput) => {
    const user = await prisma.user.create({
        data: {
            email: userData.email,
            password: userData.password,
            firstName: userData.firstName,
            lastName: userData.lastName,
            role: userData.role,
        },
    });
    return user;
};

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
