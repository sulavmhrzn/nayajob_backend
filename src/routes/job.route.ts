import express from "express";
import { createJob, getAllJobs } from "../controller/job/job.controller.ts";
import { hasRole } from "../middleware/hasRole.middleware.ts";
import { loginRequired } from "../middleware/loginRequired.middleware.ts";

const router = express.Router();

router.post("/", loginRequired, hasRole("EMPLOYER"), createJob);
router.get("/", getAllJobs);

export default router;
