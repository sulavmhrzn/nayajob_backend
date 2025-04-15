import express from "express";
import {
    Me,
    forgotPassword,
    resetPassword,
    signIn,
    signUp,
    verifyAccount,
} from "../controller/auth.controller.ts";
import { loginRequired } from "../middleware/loginRequired.middleware.ts";
import { authLimiter } from "../middleware/rateLimiter.middleware.ts";

const router = express.Router();

router.post("/signup", authLimiter, signUp);
router.post("/signin", authLimiter, signIn);
router.get("/me", loginRequired, Me);
router.get("/verify-account", verifyAccount);
router.post("/forgot-password", authLimiter, forgotPassword);
router.post("/reset-password", authLimiter, resetPassword);

export default router;
