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
                return new Date(date) >= new Date();
            },
            { message: "End date must be in the future" }
        ),
});

export type CreateEducationSchemaType = z.infer<typeof CreateEducationSchema>;

export const UpdateEducationSchema = CreateEducationSchema.partial();
export type UpdateEducationSchemaType = z.infer<typeof UpdateEducationSchema>;
