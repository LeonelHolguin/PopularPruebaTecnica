import { Router } from "express";
import {
  createProfile,
  updateProfile,
  deleteProfile,
} from "../controllers/profile/index";
import authMiddleware from "../middlewares/auth";

const profileRouter = Router();

profileRouter.post("/", createProfile);

profileRouter.put("/:id", authMiddleware, updateProfile);

profileRouter.delete("/:id", authMiddleware, deleteProfile);

export default profileRouter;
