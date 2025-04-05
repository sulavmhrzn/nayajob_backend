import z from "zod";
import { zPhoneNumber } from "../utils/general.ts";

export const UpdateSeekerProfileSchema = z.object({
    phone: zPhoneNumber,
    location: z.string().optional(),
    bio: z.string().optional(),
    gender: z.enum(["MALE", "FEMALE", "OTHERS"]).optional(),
});

export type UpdateSeekerProfileSchemaType = z.infer<
    typeof UpdateSeekerProfileSchema
>;

export const CreateEducationSchema = z.object({
    institution: z.string(),
    degree: z.string(),
    fieldOfStudy: z.string(),
    startDate: z
        .string()
        .date()
        .refine((date) => new Date(date) <= new Date(), {
            message: "Start date must be in the past",
        }),
    endDate: z
        .string()
        .date()
        .optional()
        .refine(
            (date) => {
                if (!date) return true;
                return new Date(date) <= new Date();
            },
            { message: "End date should not be in future" }
        ),
});
export type CreateEducationSchemaType = z.infer<typeof CreateEducationSchema>;

export const CreateEducationSchemaRefined = CreateEducationSchema.refine(
    (data) => {
        if (data.endDate && new Date(data.startDate) > new Date(data.endDate)) {
            return false;
        }
        return true;
    },
    { message: "End date must be after start date", path: ["endDate"] }
);

export const UpdateEducationSchema = CreateEducationSchema.partial().refine(
    (data) => {
        if (
            data.startDate &&
            data.endDate &&
            new Date(data.startDate) > new Date(data.endDate)
        ) {
            return false;
        }
        return true;
    },
    { message: "End date must be after start date", path: ["endDate"] }
);
export type UpdateEducationSchemaType = z.infer<typeof UpdateEducationSchema>;

export const CreateExperienceSchema = z.object({
    jobTitle: z
        .string({ message: "Job title is required" })
        .min(2, "Job title must be at least 2 characters"),
    companyName: z
        .string({
            message: "Company name is required",
        })
        .min(2, "Company name must be at least 2 characters"),
    startDate: z
        .string()
        .date()
        .refine((date) => new Date(date) <= new Date(), {
            message: "Start date must be in the past",
        }),
    endDate: z
        .string()
        .date()
        .optional()
        .refine(
            (date) => {
                if (!date) return true;
                return new Date(date) <= new Date();
            },
            { message: "End date should not be in future" }
        ),
    description: z.string().optional(),
});
export const CreateExperienceSchemaRefined = CreateExperienceSchema.refine(
    (data) => {
        if (
            data.endDate &&
            data.startDate &&
            new Date(data.startDate) > new Date(data.endDate)
        ) {
            return false;
        }
        return true;
    },
    { message: "End date must be after start date", path: ["endDate"] }
);
export type CreateExperienceSchemaRefinedType = z.infer<
    typeof CreateExperienceSchemaRefined
>;
export type CreateExperienceSchemaType = z.infer<typeof CreateExperienceSchema>;
