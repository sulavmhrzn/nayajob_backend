import type { Job, Prisma } from "@prisma/client";
import type { JobQuerySchemaType } from "../schema/job.schema.ts";
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
 * @param options.sort - Sorting criteria for job listings
 * @param options.title - Filter by job title
 * @param options.jobType - Filter by job type
 * @param options.jobCategory - Filter by job category
 * @returns An object containing the data (jobs and count) or an error message
 */
export const getAllJobsDB = async (
    queries: JobQuerySchemaType
): Promise<
    | {
          status: number;
          success: true;
          data: {
              jobs: Job[];
              count: number;
              limit: number;
              totalPages: number;
              page: number;
          };
      }
    | { status: number; success: false; error: string }
> => {
    const PAGE_SIZE = 10;
    try {
        const sortField = queries.sort.startsWith("-")
            ? queries.sort.slice(1)
            : queries.sort;
        const [jobs, count] = await prisma.$transaction([
            prisma.job.findMany({
                where: {
                    status: "ACTIVE",
                    title: {
                        contains: queries?.title,
                        mode: "insensitive",
                    },
                    jobType: {
                        equals: queries?.jobType,
                    },
                    category: {
                        equals: queries?.jobCategory,
                    },
                },
                include: {
                    employer: true,
                },
                orderBy: {
                    [sortField]: queries.sort.startsWith("-") ? "desc" : "asc",
                },
                take: PAGE_SIZE,
                skip: (queries.page - 1) * PAGE_SIZE,
            }),
            prisma.job.count({ where: { status: "ACTIVE" } }),
        ]);
        return {
            status: 200,
            success: true,
            data: {
                count,
                jobs,
                page: queries.page,
                limit: PAGE_SIZE,
                totalPages: Math.ceil(count / PAGE_SIZE),
            },
        };
    } catch (error) {
        logger.error("Error fetching all jobs", error);
        return {
            status: 500,
            success: false,
            error: "Error fetching all jobs",
        };
    }
};

/**
 * Fetches a job by its ID from the database.
 * @param id - The ID of the job to be fetched
 * @returns An object containing the job data or an error message
 */
export const getJobByIdDB = async (
    id: number
): Promise<
    | { status: number; success: true; data: Job }
    | { status: number; success: false; error: string }
> => {
    try {
        const job = await prisma.job.findUnique({
            where: {
                id,
            },
            include: {
                employer: true,
            },
        });
        if (!job) {
            return {
                status: 404,
                success: false,
                error: "Job not found",
            };
        }
        return { status: 200, success: true, data: job };
    } catch (error) {
        logger.error("Error fetching job by ID", error);
        return {
            status: 500,
            success: false,
            error: "Error fetching job by ID",
        };
    }
};
