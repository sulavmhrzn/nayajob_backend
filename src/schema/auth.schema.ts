import { z } from "zod";

export const CreateUserSchema = z.object({
    email: z.string({ message: "Email is required" }).email(),
    password: z
        .string({ message: "Password is required" })
        .min(8, "Password must be at least 8 characters long"),
    firstName: z
        .string({ message: "First name is required" })
        .min(1, "First name is required"),
    lastName: z
        .string({ message: "Last name is required" })
        .min(1, "Last name is required"),
    role: z.enum(["SEEKER", "EMPLOYER"]).default("SEEKER"),
    createdAt: z.date().optional().readonly(),
});

export const SignInUserSchema = z.object({
    email: z.string({ message: "Email is required" }).email(),
    password: z.string({ message: "Password is required" }),
});
