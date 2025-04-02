import express from "express";
import { Me, signIn, signUp } from "../controller/auth.controller.ts";
import { loginRequired } from "../middleware/loginRequired.middleware.ts";

const router = express.Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.get("/me", loginRequired, Me);

export default router;
