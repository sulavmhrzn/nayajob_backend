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
