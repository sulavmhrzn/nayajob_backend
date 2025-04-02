import express from "express";
import { healthCheck } from "../controller/healthCheck.controller.ts";

const router = express.Router();

router.get("/", healthCheck);

export default router;
