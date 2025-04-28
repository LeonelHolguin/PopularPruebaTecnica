import { Request, Response } from "express";
import { publishUserLoggedIn } from "../../queue/publishMessage";

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (username && password) {
    await publishUserLoggedIn(username);
    res.status(200).json({ message: "Login successful" });
  } else {
    res.status(400).json({ message: "Invalid credentials" });
  }
};
