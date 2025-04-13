import express from "express";
import {
    Me,
    signIn,
    signUp,
    verifyAccount,
} from "../controller/auth.controller.ts";
import { loginRequired } from "../middleware/loginRequired.middleware.ts";

const router = express.Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.get("/me", loginRequired, Me);
router.get("/verify-token", verifyAccount);

export default router;
