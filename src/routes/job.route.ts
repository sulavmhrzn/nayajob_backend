import express, { type RequestHandler } from "express";
import {
    createJob,
    deleteJob,
    getAllJobs,
    getJob,
    updateJob,
} from "../controller/job/job.controller.ts";
import { hasRole } from "../middleware/hasRole.middleware.ts";
import { isVerified } from "../middleware/isVerified.middleware.ts";
import { loginRequired } from "../middleware/loginRequired.middleware.ts";
import { jobLimiter } from "../middleware/rateLimiter.middleware.ts";

const router = express.Router();

router.post("/", loginRequired, hasRole("EMPLOYER"), isVerified, createJob);
router.get("/", jobLimiter, getAllJobs as unknown as RequestHandler);
router.get("/:id", jobLimiter, getJob);
router.delete(
    "/:id",
    loginRequired,
    hasRole("EMPLOYER"),
    isVerified,
    deleteJob
);
router.put("/:id", loginRequired, hasRole("EMPLOYER"), isVerified, updateJob);

export default router;
