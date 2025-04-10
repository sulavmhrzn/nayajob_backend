import express from "express";
import {
    createJob,
    getAllJobs,
    getJob,
} from "../controller/job/job.controller.ts";
import { hasRole } from "../middleware/hasRole.middleware.ts";
import { loginRequired } from "../middleware/loginRequired.middleware.ts";

const router = express.Router();

router.post("/", loginRequired, hasRole("EMPLOYER"), createJob);
router.get("/", getAllJobs);
router.get("/:id", getJob);

export default router;
