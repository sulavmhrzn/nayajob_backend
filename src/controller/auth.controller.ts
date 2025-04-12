import type { Request, Response } from "express";
import {
    type CreateUserInput,
    CreateUserSchema,
    type SignInUserInput,
    SignInUserSchema,
} from "../schema/auth.schema.ts";
import { createEmployerProfile } from "../service/employerProfile.service.ts";
import { createSeekerProfile } from "../service/seekerProfile.service.ts";
import { createUser, getUserByEmail } from "../service/user.service.ts";
import {
    generateJWTToken,
    hashPassword,
    verifyPassword,
} from "../utils/auth.ts";
import { Envelope } from "../utils/envelope.ts";
import { prettyZodError } from "../utils/general.ts";

export const signUp = async (
    req: Request<unknown, unknown, CreateUserInput>,
    res: Response
) => {
    const parsed = CreateUserSchema.safeParse(req.body);

    if (!parsed.success) {
        const errors = prettyZodError(parsed.error);
        const envelope = Envelope.error("validation error", errors);
        res.status(400).json(envelope);
        return;
    }
    const hash = await hashPassword(parsed.data.password);
    if (hash.success) {
        parsed.data.password = hash.hash;
    } else {
        const envelope = Envelope.error("hashing error", {
            error: hash.error,
        });
        req.log.error(hash.error, "error hashing password");
        res.status(500).json(envelope);
        return;
    }
    const user = await getUserByEmail(parsed.data.email);
    if (user) {
        const envelope = Envelope.error("user already exists", {
            email: parsed.data.email,
        });
        res.status(409).json(envelope);
        return;
    }

    const newUser = await createUser(parsed.data);
    switch (newUser.role) {
        case "SEEKER": {
            req.log.info("User is a seeker, creating seeker profile");
            const profile = await createSeekerProfile(newUser.id);
            if (!profile.success) {
                req.log.error("Error creating seeker profile", profile.error);
                const envelope = Envelope.error(
                    "error creating seeker profile",
                    {
                        error: profile.error,
                    }
                );
                res.status(profile.status).json(envelope);
                return;
            }
            break;
        }
        case "EMPLOYER": {
            req.log.info("User is an employer, creating employer profile");
            const profile = await createEmployerProfile(newUser);
            if (!profile.success) {
                req.log.error("Error creating employer profile", profile.error);
                const envelope = Envelope.error(
                    "error creating employer profile",
                    {
                        error: profile.error,
                    }
                );
                res.status(profile.status).json(envelope);
                return;
            }
            break;
        }
        default: {
            req.log.error("User role is not recognized");
            const envelope = Envelope.error("user role not recognized", {
                role: newUser.role,
            });
            res.status(500).json(envelope);
            return;
        }
    }

    const envelope = Envelope.success("user created successfully", {
        email: parsed.data.email,
        first_name: parsed.data.firstName,
        last_name: parsed.data.lastName,
        role: parsed.data.role,
        createdAt: newUser.createdAt,
    });
    req.log.info(newUser, "user created successfully");
    res.status(201).json(envelope);
};

export const signIn = async (
    req: Request<unknown, unknown, SignInUserInput>,
    res: Response
) => {
    const parsed = SignInUserSchema.safeParse(req.body);
    if (!parsed.success) {
        const errors = prettyZodError(parsed.error);
        const envelope = Envelope.error("validation error", errors);
        res.status(400).json(envelope);
        return;
    }
    const user = await getUserByEmail(parsed.data.email);
    if (!user) {
        const envelope = Envelope.error("invalid credentials");
        res.status(401).json(envelope);
        return;
    }
    const isValid = await verifyPassword(user.password, parsed.data.password);
    if (!isValid) {
        const envelope = Envelope.error("invalid credentials");
        res.status(401).json(envelope);
        return;
    }
    const token = generateJWTToken({
        id: user.id,
        role: user.role,
        email: user.email,
    });
    const envelope = Envelope.success("sign-in successful", {
        email: user.email,
        first_name: user.firstName,
        last_name: user.lastName,
        role: user.role,
        token,
    });

    res.status(200).json(envelope);
};

export const Me = async (req: Request, res: Response) => {
    if (!req.user) {
        const envelope = Envelope.error("unauthorized", "user not found");
        res.status(401).json(envelope);
        return;
    }
    const user = await getUserByEmail(req.user.email);
    if (!user) {
        const envelope = Envelope.error(
            "user not found",
            "No user associated with this email"
        );
        res.status(404).json(envelope);
        return;
    }
    const envelope = Envelope.success("user found", {
        email: user.email,
        first_name: user.firstName,
        last_name: user.lastName,
        role: user.role,
        createdAt: user.createdAt,
    });

    res.json(envelope);
};
