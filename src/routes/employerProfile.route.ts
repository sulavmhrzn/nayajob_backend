import express from "express";
import { getEmployerProfile } from "../controller/employerProfile/profile.controller.ts";
import { hasRole } from "../middleware/hasRole.middleware.ts";
import { loginRequired } from "../middleware/loginRequired.middleware.ts";
const router = express.Router();

router.get("/", loginRequired, hasRole("EMPLOYER"), getEmployerProfile);

export default router;
