import express from "express";
import { getSeekerProfile } from "../controller/profile.controller.ts";
import { hasRole } from "../middleware/hasRole.middleware.ts";
import { loginRequired } from "../middleware/loginRequired.middleware.ts";

const router = express.Router();

router.get(
    "/seeker-profile",
    loginRequired,
    hasRole("SEEKER"),
    getSeekerProfile
);

export default router;
