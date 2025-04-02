import { type Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Get a user by email from the database
 * @param email - The email of the user to be retrieved
 * @returns The user object or null if not found
 */
export const getUserByEmail = async (email: string) => {
    const user = await prisma.user.findUnique({
        select: { email: true, firstName: true, lastName: true, role: true },
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
