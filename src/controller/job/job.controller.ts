import type { Request, Response } from "express";
import {
    CreateJobSchema,
    type CreateJobSchemaType,
    JobQuerySchema,
    type JobQuerySchemaType,
    UpdateJobSchema,
} from "../../schema/job.schema.ts";
import {
    createJobDB,
    deleteJobByIdDB,
    getAllJobsDB,
    getJobByIdDB,
    updateJobDB,
} from "../../service/job.service.ts";
import { Envelope } from "../../utils/envelope.ts";
import {
    UserAndEmployerProfileExists,
    parseJobId,
    prettyZodError,
} from "../../utils/general.ts";

export const createJob = async (
    req: Request<unknown, unknown, CreateJobSchemaType>,
    res: Response
) => {
    const { data: response, error } = await UserAndEmployerProfileExists(
        req,
        res
    );
    if (error) {
        res.status(error.status).json(error.envelope);
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
        employerId: response.profile.id,
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
    const parsed = parseJobId(req.params.id);
    if (!parsed.success) {
        const envelope = Envelope.error("Invalid job id", parsed.error);
        res.status(400).json(envelope);
        return;
    }
    const job = await getJobByIdDB(parsed.data);
    if (!job.success) {
        const envelope = Envelope.error("Failed to fetch job", job.error);
        res.status(job.status).json(envelope);
        return;
    }
    const envelope = Envelope.success("Job fetched successfully", job.data);
    res.status(200).json(envelope);
};

export const deleteJob = async (
    req: Request<{ id: string }>,
    res: Response
) => {
    const parsed = parseJobId(req.params.id);
    if (!parsed.success) {
        const envelope = Envelope.error("Invalid job id", parsed.error);
        res.status(400).json(envelope);
        return;
    }
    const { data: response, error } = await UserAndEmployerProfileExists(
        req,
        res
    );
    if (error) {
        res.status(error.status).json(error.envelope);
        return;
    }
    const result = await deleteJobByIdDB(parsed.data, response.profile.id);
    if (!result.success) {
        const envelope = Envelope.error("Failed to delete job", result.error);
        res.status(result.status).json(envelope);
        return;
    }
    const envelope = Envelope.success("Job deleted successfully", result.data);
    res.json(envelope);
};

export const updateJob = async (
    req: Request<{ id: string }, unknown, CreateJobSchemaType>,
    res: Response
) => {
    const parsedId = parseJobId(req.params.id);
    if (!parsedId.success) {
        const envelope = Envelope.error("Invalid job id", parsedId.error);
        res.status(400).json(envelope);
        return;
    }
    const parsedData = UpdateJobSchema.safeParse(req.body);
    if (!parsedData.success) {
        const error = prettyZodError(parsedData.error);
        const envelope = Envelope.error("Invalid data", error);
        res.status(400).json(envelope);
        return;
    }
    const { data: response, error } = await UserAndEmployerProfileExists(
        req,
        res
    );
    if (error) {
        res.status(error.status).json(error.envelope);
        return;
    }
    const job = await updateJobDB(parsedId.data, response.profile.id, {
        ...parsedData.data,
        deadline:
            parsedData.data.deadline && new Date(parsedData.data.deadline),
    });
    if (!job.success) {
        const envelope = Envelope.error("Failed to update job", job.error);
        res.status(job.status).json(envelope);
        return;
    }
    const envelope = Envelope.success("Job updated successfully", job.data);
    res.status(200).json(envelope);
};
