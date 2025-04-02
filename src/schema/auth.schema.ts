import { z } from "zod";

export const CreateUserSchema = z
    .object({
        email: z.string({ message: "Email is required" }).email(),
        password: z
            .string({ message: "Password is required" })
            .min(8, "Password must be at least 8 characters long"),
        first_name: z
            .string({ message: "First name is required" })
            .min(1, "First name is required"),
        last_name: z
            .string({ message: "Last name is required" })
            .min(1, "Last name is required"),
        role: z.enum(["SEEKER", "EMPLOYER"]).default("SEEKER"),
        createdAt: z.date().optional().readonly(),
    })
    .transform((data) => {
        return {
            email: data.email,
            password: data.password,
            firstName: data.first_name,
            lastName: data.last_name,
            role: data.role,
            createdAt: data.createdAt,
        };
    });
