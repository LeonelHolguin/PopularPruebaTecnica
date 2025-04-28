import { Request, Response } from "express";
import { Profile } from "../../interfaces/Profile";
import { generateToken } from "../../utils/jwt";
import { ProfileModel } from "../../models/Profile";
import { ProfileSchema } from "../../validators/profile.validator";
import { publishProfileCreated } from "../../queue/publishMessage";

export const createProfile = async (req: Request, res: Response) => {
  try {
    const validation = ProfileSchema.safeParse(req.body);

    if (!validation.success) {
      res.status(400).json({
        message: "Invalid data",
        errors: validation.error.format(),
      });
      return;
    }

    const profileData = validation.data;

    const createdProfile = await ProfileModel.create(profileData);

    const tokenPayload = {
      _id: createdProfile._id,
      name: createdProfile.name,
      lastName: createdProfile.lastName,
      email: createdProfile.email,
    } as Profile;

    const token = generateToken(tokenPayload);
    await publishProfileCreated(tokenPayload);

    res.status(201).send({ token });
  } catch (error) {
    res.status(500).send({
      message: "Error creating profile",
      description: (error as Error).message,
    });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validation = ProfileSchema.safeParse(req.body);

    if (!validation.success) {
      res.status(400).json({
        message: "Invalid data",
        errors: validation.error.format(),
      });
      return;
    }

    const updated = await ProfileModel.findByIdAndUpdate(id, validation.data, {
      new: true,
    });

    if (!updated) {
      res.status(404).json({ message: "Profile not found" });
      return;
    }

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).send({
      message: "Error updating profile",
      description: (error as Error).message,
    });
  }
};

export const deleteProfile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deleted = await ProfileModel.findByIdAndDelete(id);

    if (!deleted) {
      res.status(404).json({ message: "Profile not found" });
      return;
    }

    res.status(204).send(id);
  } catch (error) {
    res.status(500).send({
      message: "Error deleting profile",
      description: (error as Error).message,
    });
  }
};
