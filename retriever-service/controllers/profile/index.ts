import { Request, Response } from "express";
import { ProfileModel } from "../../models/Profile";

export const getProfile = async (req: Request, res: Response) => {
  const { id } = req.params;
  const profile = await ProfileModel.findById(id);
  if (!profile) {
    res.status(404).json({ message: "Profile not found" });
    return;
  }
  res.status(200).json(profile);
};
