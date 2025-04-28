import { Router } from "express";
import { getProfile } from "../controllers/profile/index";
import authMiddleware from "../middlewares/auth";

const profileRouter = Router();

profileRouter.get("/:id", authMiddleware, getProfile);

export default profileRouter;
