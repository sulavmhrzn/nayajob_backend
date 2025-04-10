import type { Request, Response } from "express";
import { z } from "zod";
import {
    CreateJobSchema,
    type CreateJobSchemaType,
    JobQuerySchema,
    type JobQuerySchemaType,
} from "../../schema/job.schema.ts";
import { getEmployerProfileByUserId } from "../../service/employerProfile.service.ts";
import {
    createJobDB,
    getAllJobsDB,
    getJobByIdDB,
} from "../../service/job.service.ts";
import { Envelope } from "../../utils/envelope.ts";
import { prettyZodError } from "../../utils/general.ts";

export const createJob = async (
    req: Request<any, any, CreateJobSchemaType>,
    res: Response
) => {
    const user = req.user;
    if (!user) {
        const envelope = Envelope.error("Unauthorized");
        res.status(401).json(envelope);
        return;
    }
    const profile = await getEmployerProfileByUserId(user.id);
    if (!profile.success) {
        const envelope = Envelope.error(
            "failed to fetch employer profile",
            profile.error
        );
        res.status(profile.status).json(envelope);
        return;
    }
    const parsed = CreateJobSchema.safeParse(req.body);
    if (!parsed.success) {
        const error = prettyZodError(parsed.error);
        const envelope = Envelope.error("Invalid data", error);
        res.status(400).json(envelope);
        return;
    }
    const data = {
        ...parsed.data,
        employerId: profile.data.id,
        deadline: new Date(parsed.data.deadline),
    };
    const job = await createJobDB(data);
    if (!job.success) {
        const envelope = Envelope.error("Failed to create job", job.error);
        res.status(job.status).json(envelope);
        return;
    }
    const envelope = Envelope.success("Job created", job.data);
    res.status(201).json(envelope);
};

export const getAllJobs = async (
    req: Request<Record<string, never>, unknown, unknown, JobQuerySchemaType>,
    res: Response
) => {
    const parsedQueries = JobQuerySchema.safeParse(req.query);
    req.log.info("Parsed queries", parsedQueries);
    if (!parsedQueries.success) {
        const error = prettyZodError(parsedQueries.error);
        const envelope = Envelope.error("Invalid query", error);
        res.status(400).json(envelope);
        return;
    }
    const result = await getAllJobsDB({
        ...parsedQueries.data,
    });
    if (!result.success) {
        const envelope = Envelope.error("Failed to fetch jobs", result.error);
        res.status(result.status).json(envelope);
        return;
    }
    const metaData = {
        count: result.data.count,
        page: result.data.page,
        limit: result.data.limit,
        totalPages: result.data.totalPages,
    };
    const envelope = Envelope.success("Jobs fetched successfully", {
        metaData,
        jobs: result.data.jobs,
    });
    res.status(200).json(envelope);
};

export const getJob = async (req: Request<{ id: string }>, res: Response) => {
    const parsedId = z
        .object({
            id: z.coerce.number({ message: "Invalid job id" }),
        })
        .safeParse(req.params);
    if (!parsedId.success) {
        const error = prettyZodError(parsedId.error);
        const envelope = Envelope.error("Invalid job id", error);
        res.status(400).json(envelope);
        return;
    }

    const job = await getJobByIdDB(parsedId.data.id);
    if (!job.success) {
        const envelope = Envelope.error("Failed to fetch job", job.error);
        res.status(job.status).json(envelope);
        return;
    }
    const envelope = Envelope.success("Job fetched successfully", job.data);
    res.status(200).json(envelope);
};
