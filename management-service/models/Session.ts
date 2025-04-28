import mongoose from "mongoose";
import { Session } from "../interfaces/Session";

const SessionSchema = new mongoose.Schema<Session>({
  username: { type: String, required: true },
  loginTime: { type: Date, required: true },
});

export const SessionModel = mongoose.model<Session>("Session", SessionSchema);
