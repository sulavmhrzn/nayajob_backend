import type { Request, Response } from "express";
import type { JwtPayload } from "jsonwebtoken";
import {
    type CreateUserInput,
    CreateUserSchema,
    type SignInUserInput,
    SignInUserSchema,
} from "../schema/auth.schema.ts";
import { createEmployerProfile } from "../service/employerProfile.service.ts";
import { createSeekerProfile } from "../service/seekerProfile.service.ts";
import {
    createUser,
    getUserByEmail,
    updateUserById,
} from "../service/user.service.ts";
import {
    generateJWTToken,
    hashPassword,
    verifyJWTToken,
    verifyPassword,
} from "../utils/auth.ts";
import { sendWelcomeEmail } from "../utils/email.ts";
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
    if (!user.success) {
        const envelope = Envelope.error("error fetching user", user.error);
        req.log.error(user.error, "error fetching user");
        res.status(user.status).json(envelope);
        return;
    }

    if (user.data) {
        const envelope = Envelope.error("user already exists", {
            email: parsed.data.email,
        });
        res.status(409).json(envelope);
        return;
    }

    const newUser = await createUser(parsed.data);
    if (!newUser.success) {
        const envelope = Envelope.error("error creating user", {
            error: newUser.error,
        });
        req.log.error(newUser.error, "error creating user");
        res.status(newUser.status).json(envelope);
        return;
    }
    const token = generateJWTToken(
        { id: newUser.data.id, email: newUser.data.email },
        { jwtExpiresIn: "15min" }
    );
    await sendWelcomeEmail([newUser.data.email], token);

    switch (newUser.data.role) {
        case "SEEKER": {
            req.log.info("User is a seeker, creating seeker profile");
            const profile = await createSeekerProfile(newUser.data.id);
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
            const profile = await createEmployerProfile(newUser.data, {
                companyName:
                    parsed.data.companyName ??
                    `${newUser.data.firstName}'s Company`,
            });
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
                role: newUser.data.role,
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
        createdAt: newUser.data.createdAt,
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
    if (!user.success) {
        const envelope = Envelope.error("error fetching user", {
            error: user.error,
        });
        req.log.error(user.error, "error fetching user");
        res.status(user.status).json(envelope);
        return;
    }
    if (user.status === 404) {
        const envelope = Envelope.error("invalid credentials");
        res.status(401).json(envelope);
        return;
    }
    if (!user.data) {
        const envelope = Envelope.error("user not found");
        res.status(404).json(envelope);
        return;
    }
    const isValid = await verifyPassword(
        user.data.password,
        parsed.data.password
    );
    if (!isValid) {
        const envelope = Envelope.error("invalid credentials");
        res.status(401).json(envelope);
        return;
    }
    const token = generateJWTToken({
        id: user.data.id,
        role: user.data.role,
        email: user.data.email,
        isVerified: user.data.isVerified,
    });
    const envelope = Envelope.success("sign-in successful", {
        email: user.data.email,
        first_name: user.data.firstName,
        last_name: user.data.lastName,
        role: user.data.role,
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
    if (!user.success) {
        const envelope = Envelope.error("Error fetching user", user.error);
        res.status(user.status).json(envelope);
        return;
    }
    if (user.status === 404) {
        const envelope = Envelope.error("user not found", "No user found");
        res.status(404).json(envelope);
        return;
    }
    if (!user.data) {
        const envelope = Envelope.error("user not found", "No user found");
        res.status(404).json(envelope);
        return;
    }
    const envelope = Envelope.success("user found", {
        email: user.data.email,
        first_name: user.data.firstName,
        last_name: user.data.lastName,
        role: user.data.role,
        createdAt: user.data.createdAt,
        isVerified: user.data.isVerified,
    });

    res.json(envelope);
};

export const verifyAccount = async (req: Request, res: Response) => {
    const { token } = req.query;
    const valid = verifyJWTToken(token as string);
    if (!valid.success) {
        const envelope = Envelope.error("invalid token", valid.error);
        res.status(401).json(envelope);
        return;
    }
    const { email } = valid.payload as JwtPayload;
    if (!email) {
        const envelope = Envelope.error(
            "invalid token",
            "No email found in token"
        );
        res.status(401).json(envelope);
        return;
    }
    const user = await getUserByEmail(email);
    if (!user.success) {
        const envelope = Envelope.error("error fetching user", user.error);
        res.status(user.status).json(envelope);
        return;
    }
    if (user.status === 404) {
        const envelope = Envelope.error("user not found", "No user found");
        res.status(404).json(envelope);
        return;
    }
    if (!user.data) {
        const envelope = Envelope.error("user not found", "No user found");
        res.status(404).json(envelope);
        return;
    }
    if (user.data.isVerified) {
        const envelope = Envelope.error(
            "user already verified",
            "User is already verified"
        );
        res.status(409).json(envelope);
        return;
    }
    const updatedUser = await updateUserById(user.data.id, {
        isVerified: true,
    });
    if (!updatedUser.success) {
        const envelope = Envelope.error(
            "error updating user",
            updatedUser.error
        );
        res.status(500).json(envelope);
        return;
    }

    const envelope = Envelope.success("account verified", {
        email: user.data.email,
        first_name: user.data.firstName,
        last_name: user.data.lastName,
        role: user.data.role,
        createdAt: user.data.createdAt,
        updatedAt: user.data.updatedAt,
    });
    res.json(envelope);
};
