import express from "express";
import {
    getEmployerProfile,
    updateEmployerCompanyLogo,
    updateEmployerProfile,
} from "../controller/employerProfile/profile.controller.ts";
import { hasRole } from "../middleware/hasRole.middleware.ts";
import { loginRequired } from "../middleware/loginRequired.middleware.ts";
const router = express.Router();

router.get("/", loginRequired, hasRole("EMPLOYER"), getEmployerProfile);
router.put("/", loginRequired, hasRole("EMPLOYER"), updateEmployerProfile);

router.put(
    "/logo",
    loginRequired,
    hasRole("EMPLOYER"),
    updateEmployerCompanyLogo
);
export default router;
