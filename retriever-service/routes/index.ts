import { Router } from "express";
import profileRouter from "./profile";
import healthcheckRouter from "./healthcheck";
import authRouter from "./auth";

const router = Router();

router.use("/profile", profileRouter);
router.use("/healthcheck", healthcheckRouter);
router.use("/auth", authRouter);

export default router;
