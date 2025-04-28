import mongoose from "mongoose";
import { Profile } from "../interfaces/Profile";

const profileSchema = new mongoose.Schema<Profile>(
  {
    name: { type: String, required: true },
    lastName: { type: String, required: true },
    cellphone: { type: String, required: false },
    email: { type: String, required: true, unique: true },
    address: { type: String, required: false },
  },
  { timestamps: true }
);

export const ProfileModel = mongoose.model<Profile>("profile", profileSchema);
