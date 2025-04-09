import type { Request, Response } from "express";
import {
    CreateJobSchema,
    type CreateJobSchemaType,
} from "../../schema/job.schema.ts";
import { getEmployerProfileByUserId } from "../../service/employerProfile.service.ts";
import { createJobDB, getAllJobsDB } from "../../service/job.service.ts";
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

// TODO: Add filtering and sorting options
export const getAllJobs = async (req: Request, res: Response) => {
    const page = Number(req.query.page) || 1;
    const result = await getAllJobsDB({ page });
    if (!result.success) {
        const envelope = Envelope.error("Failed to fetch jobs", result.error);
        res.status(result.status).json(envelope);
        return;
    }
    const metaData = {
        count: result.data.count,
        page: page,
        limit: 5,
        totalPages: Math.ceil(result.data.count / 5),
    };
    const envelope = Envelope.success("Jobs fetched successfully", {
        metaData,
        jobs: result.data.jobs,
    });
    res.status(200).json(envelope);
};
