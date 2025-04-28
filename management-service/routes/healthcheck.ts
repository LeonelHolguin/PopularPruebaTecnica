import { Router } from "express";

const healthcheckRouter = Router();

healthcheckRouter.get("/", (req, res) => {
  res.status(200).json({ message: "OK" });
});

export default healthcheckRouter;
