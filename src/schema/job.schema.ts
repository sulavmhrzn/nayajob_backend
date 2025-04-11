import { JobCategory, JobStatus, JobType } from "@prisma/client";
import z from "zod";

export const CreateJobSchema = z.object({
    title: z.string().max(100).nonempty(),
    description: z.string().max(500).nonempty(),
    location: z.string().nonempty().optional(),
    descriptionSummary: z.string().max(500).optional(),
    category: z.nativeEnum(JobCategory),
    minimumSalary: z.number().min(1).optional(),
    maximumSalary: z.number().min(1).optional(),
    jobType: z.nativeEnum(JobType),
    deadline: z
        .string()
        .date()
        .refine((date) => new Date(date) > new Date(), {
            message: "Deadline must be in the future",
        }),
    status: z.nativeEnum(JobStatus).default(JobStatus.ACTIVE),
});

export type CreateJobSchemaType = z.infer<typeof CreateJobSchema>;

export const JobQuerySchema = z.object({
    page: z.coerce.number().min(1).optional().default(1),
    sort: z
        .enum(["createdAt", "category", "-createdAt", "-category"])
        .optional()
        .default("createdAt"),
    title: z.string().optional(),
    jobType: z.nativeEnum(JobType).optional(),
    jobCategory: z.nativeEnum(JobCategory).optional(),
});

export type JobQuerySchemaType = z.infer<typeof JobQuerySchema>;

export const UpdateJobSchema = CreateJobSchema.partial();
export type UpdateJobSchemaType = z.infer<typeof UpdateJobSchema>;
