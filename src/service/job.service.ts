import type { Job, Prisma } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import type { JobQuerySchemaType } from "../schema/job.schema.ts";
import { prisma } from "../service/db.ts";
import { logger } from "../utils/logger.ts";

type ErrorResponse = {
    status: number;
    success: false;
    error: string;
};
type SuccessResponse<T> = {
    status: number;
    success: true;
    data: T;
};

type JobResponse<T> = ErrorResponse | SuccessResponse<T>;

/**
 * Creates a new job in the database.
 * @param data - Job data to be created
 * @returns The created job or an error message
 */
export const createJobDB = async (
    data: Prisma.JobCreateInput
): Promise<JobResponse<Job>> => {
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
    JobResponse<{
        jobs: Job[];
        count: number;
        limit: number;
        totalPages: number;
        page: number;
    }>
> => {
    const PAGE_SIZE = 10;
    try {
        const sortField = queries.sort.startsWith("-")
            ? queries.sort.slice(1)
            : queries.sort;
        const where: Prisma.JobWhereInput = {
            status: "ACTIVE",
        };
        if (queries?.title) {
            where.title = {
                contains: queries.title,
                mode: "insensitive",
            };
        }
        if (queries?.jobType) {
            where.jobType = {
                equals: queries.jobType,
            };
        }
        if (queries?.jobCategory) {
            where.category = {
                equals: queries.jobCategory,
            };
        }
        if (queries?.experienceLevel) {
            where.experienceLevel = {
                equals: queries.experienceLevel,
            };
        }
        const [jobs, count] = await prisma.$transaction([
            prisma.job.findMany({
                where,
                include: {
                    employer: true,
                },
                orderBy: {
                    [sortField]: queries.sort.startsWith("-") ? "desc" : "asc",
                },
                take: PAGE_SIZE,
                skip: (queries.page - 1) * PAGE_SIZE,
            }),
            prisma.job.count({ where }),
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
export const getJobByIdDB = async (id: number): Promise<JobResponse<Job>> => {
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

/**
 * Deletes a job by its ID from the database.
 * @param jobId - The ID of the job to be deleted
 * @param employerID - The ID of the employer requesting the deletion
 * @returns An object containing the status and success of the operation or an error message
 */
export const deleteJobByIdDB = async (
    jobId: number,
    employerID: number
): Promise<JobResponse<Job>> => {
    try {
        const job = await prisma.job.findUnique({
            where: { id: jobId },
        });
        if (!job) {
            return {
                status: 404,
                success: false,
                error: "Job not found",
            };
        }
        if (job.employerId !== employerID) {
            return {
                status: 403,
                success: false,
                error: "You are not authorized to delete this job",
            };
        }
        const deletedJob = await prisma.job.delete({
            where: {
                id: jobId,
            },
        });
        return {
            status: 200,
            success: true,
            data: deletedJob,
        };
    } catch (error: unknown) {
        logger.error("Error deleting job by ID", error);
        if (error instanceof PrismaClientKnownRequestError) {
            if (error.code === "P2025") {
                return {
                    status: 404,
                    success: false,
                    error: "Job not found",
                };
            }
        }
        return {
            status: 500,
            success: false,
            error: "Error deleting job",
        };
    }
};

/**
 * Updates a job in the database.
 * @param id - The ID of the job to be updated
 * @param profileID - The ID of the employer updating the job
 * @param data - The data to update the job with
 * @returns An object containing the status and success of the operation or an error message
 */
export const updateJobDB = async (
    id: number,
    profileID: number,
    data: Prisma.JobUpdateInput
): Promise<JobResponse<Job>> => {
    try {
        const job = await prisma.job.findUnique({
            where: { id },
        });
        if (!job) {
            return {
                status: 404,
                success: false,
                error: "Job not found",
            };
        }
        if (job.employerId !== profileID) {
            return {
                status: 403,
                success: false,
                error: "You are not authorized to update this job",
            };
        }
        const updatedJob = await prisma.job.update({
            where: { id },
            data,
        });
        return {
            status: 200,
            success: true,
            data: updatedJob,
        };
    } catch (error) {
        logger.error("Error updating job", error);
        return {
            status: 500,
            success: false,
            error: "Error updating job",
        };
    }
};
