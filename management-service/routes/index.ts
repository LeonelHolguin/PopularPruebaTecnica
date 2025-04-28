import { Router } from "express";
import profileRouter from "./profile";
import healthcheckRouter from "./healthcheck";

const router = Router();

router.use("/profile", profileRouter);
router.use("/healthcheck", healthcheckRouter);

export default router;
