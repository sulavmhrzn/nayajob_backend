import express from "express";
import {
    addSeekerEducation,
    addSeekerExperience,
    deleteSeekerEducation,
    deleteSeekerExperience,
    getSeekerEducation,
    getSeekerExperience,
    getSeekerProfile,
    updateSeekerEducation,
    updateSeekerProfile,
} from "../controller/seekerProfile/index.ts";
import { hasRole } from "../middleware/hasRole.middleware.ts";
import { loginRequired } from "../middleware/loginRequired.middleware.ts";

const router = express.Router();

const seekerProfileBasicRouter = router.route("/");
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

const seekerProfileEducationRouter = router.route("/education");
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
    "/education/:educationId",
    loginRequired,
    hasRole("SEEKER"),
    deleteSeekerEducation
);
router.put(
    "/education/:educationId",
    loginRequired,
    hasRole("SEEKER"),
    updateSeekerEducation
);

const seekerProfileExperienceRouter = router.route("/experience");
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
router.delete(
    "/experience/:experienceId",
    loginRequired,
    hasRole("SEEKER"),
    deleteSeekerExperience
);
export default router;
