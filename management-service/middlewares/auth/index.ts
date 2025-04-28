import { NextFunction, Request, Response } from "express";
import { jwtValidator } from "../../utils/jwt";
import { Profile } from "../../interfaces/Profile";

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const tokenBearer = req.headers.authorization;
  if (!tokenBearer) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  if (tokenBearer.split(" ")[0] !== "Bearer") {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const token = tokenBearer.split(" ")[1];
  try {
    const decoded = jwtValidator(token) as Profile & { _id: string };

    if (!decoded) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const { id } = req.params;
    if (id && decoded._id && id !== decoded._id) {
      res.status(403).json({
        message: "Permission denied",
      });
      return;
    }
    next();
  } catch (error) {
    res
      .status(401)
      .json({ message: "Unauthorized", error: (error as Error).message });
  }
};

export default authMiddleware;
