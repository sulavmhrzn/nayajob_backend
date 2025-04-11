import express from "express";
import {
    createJob,
    deleteJob,
    getAllJobs,
    getJob,
    updateJob,
} from "../controller/job/job.controller.ts";
import { hasRole } from "../middleware/hasRole.middleware.ts";
import { loginRequired } from "../middleware/loginRequired.middleware.ts";

const router = express.Router();

router.post("/", loginRequired, hasRole("EMPLOYER"), createJob);
router.get("/", getAllJobs);
router.get("/:id", getJob);
router.delete("/:id", loginRequired, hasRole("EMPLOYER"), deleteJob);
router.put("/:id", loginRequired, hasRole("EMPLOYER"), updateJob);

export default router;
