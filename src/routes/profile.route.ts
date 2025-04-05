import express from "express";
import {
    addSeekerEducation,
    addSeekerExperience,
    deleteSeekerEducation,
    getSeekerEducation,
    getSeekerExperience,
    getSeekerProfile,
    updateSeekerEducation,
    updateSeekerProfile,
} from "../controller/profile.controller.ts";
import { hasRole } from "../middleware/hasRole.middleware.ts";
import { loginRequired } from "../middleware/loginRequired.middleware.ts";

const router = express.Router();

const seekerProfileBasicRouter = router.route("/seeker-profile");
seekerProfileBasicRouter.get(
    loginRequired,
    hasRole("SEEKER"),
    getSeekerProfile
);
seekerProfileBasicRouter.put(
    loginRequired,
    hasRole("SEEKER"),
    updateSeekerProfile
);

const seekerProfileEducationRouter = router.route("/seeker-profile/education");
seekerProfileEducationRouter.get(
    loginRequired,
    hasRole("SEEKER"),
    getSeekerEducation
);
seekerProfileEducationRouter.post(
    loginRequired,
    hasRole("SEEKER"),
    addSeekerEducation
);
router.delete(
    "/seeker-profile/education/:educationId",
    loginRequired,
    hasRole("SEEKER"),
    deleteSeekerEducation
);
router.put(
    "/seeker-profile/education/:educationId",
    loginRequired,
    hasRole("SEEKER"),
    updateSeekerEducation
);

const seekerProfileExperienceRouter = router.route(
    "/seeker-profile/experience"
);
seekerProfileExperienceRouter.get(
    loginRequired,
    hasRole("SEEKER"),
    getSeekerExperience
);
seekerProfileExperienceRouter.post(
    loginRequired,
    hasRole("SEEKER"),
    addSeekerExperience
);
export default router;
