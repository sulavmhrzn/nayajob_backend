import type { Job, Prisma } from "@prisma/client";
import { prisma } from "../service/db.ts";
import { logger } from "../utils/logger.ts";

/**
 * Creates a new job in the database.
 * @param data - Job data to be created
 * @returns The created job or an error message
 */
export const createJobDB = async (
    data: Prisma.JobCreateInput
): Promise<
    | { status: number; success: true; data: Job }
    | { status: number; success: false; error: string }
> => {
    try {
        const job = await prisma.job.create({
            data: data,
        });
        return { status: 201, success: true, data: job };
    } catch (error) {
        logger.error("Error creating job", error);
        return {
            status: 500,
            success: false,
            error: "Error creating job",
        };
    }
};

/**
 * Retrieve paginated job listings from the database with optional filters.
 * @param options - Query options for job retrieval
 * @param options.page - Page number for pagination
 * @returns An object containing the data (jobs and count) or an error message
 */
export const getAllJobsDB = async ({
    page = 1,
}: {
    page?: number;
}): Promise<
    | { status: number; success: true; data: { jobs: Job[]; count: number } }
    | { status: number; success: false; error: string }
> => {
    try {
        const [jobs, count] = await prisma.$transaction([
            prisma.job.findMany({
                where: {
                    status: "ACTIVE",
                },
                include: {
                    employer: true,
                },
                orderBy: {
                    createdAt: "desc",
                },
                take: 5,
                skip: (page - 1) * 5,
            }),
            prisma.job.count({ where: { status: "ACTIVE" } }),
        ]);
        return { status: 200, success: true, data: { count, jobs } };
    } catch (error) {
        logger.error("Error fetching all jobs", error);
        return {
            status: 500,
            success: false,
            error: "Error fetching all jobs",
        };
    }
};
