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

const router = express.Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.get("/me", loginRequired, Me);
router.get("/verify-account", verifyAccount);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
