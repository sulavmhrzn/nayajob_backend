import { z } from "zod";
import zxcvbn from "zxcvbn";

export const CreateUserSchema = z
    .object({
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
        companyName: z.string().optional(),
        createdAt: z.date().optional().readonly(),
        isVerified: z.boolean().optional().readonly(),
    })
    .superRefine((data, ctx) => {
        if (data.password.length < 8) {
            return z.NEVER;
        }
        const result = zxcvbn(data.password, [data.firstName, data.lastName]);
        if (result.score < 3) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message:
                    "Password is too weak or similar to your name, please use a stronger password",
                path: ["password"],
            });
            return z.NEVER;
        }
        if (data.role === "EMPLOYER") {
            !data.companyName &&
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Company name is required for employer role",
                    path: ["companyName"],
                });

            data.companyName &&
                data.companyName.length < 3 &&
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Company name must be at least 3 characters long",
                    path: ["companyName"],
                });
            return z.NEVER;
        }
    });

export const SignInUserSchema = z.object({
    email: z.string({ message: "Email is required" }).email(),
    password: z.string({ message: "Password is required" }),
});

export type CreateUserInput = z.infer<typeof CreateUserSchema>;
export type SignInUserInput = z.infer<typeof SignInUserSchema>;
