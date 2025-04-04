import express from "express";
import {
    getSeekerProfile,
    updateSeekerProfile,
} from "../controller/profile.controller.ts";
import { hasRole } from "../middleware/hasRole.middleware.ts";
import { loginRequired } from "../middleware/loginRequired.middleware.ts";

const router = express.Router();

router.get(
    "/seeker-profile",
    loginRequired,
    hasRole("SEEKER"),
    getSeekerProfile
);
router.put(
    "/seeker-profile",
    loginRequired,
    hasRole("SEEKER"),
    updateSeekerProfile
);

export default router;
