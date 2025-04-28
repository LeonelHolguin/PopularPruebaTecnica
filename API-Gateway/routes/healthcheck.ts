import { Router } from "express";
import { checkServiceHealth } from "../utils/healthCheck";

const healthcheckRouter = Router();

const services = {
  management: process.env.MANAGEMENT_URL! + "/healthcheck",
  retriever: process.env.RETRIEVER_URL! + "/healthcheck",
};

healthcheckRouter.get("/", async (req, res) => {
  try {
    const [managementHealth, retrieverHealth] = await Promise.all([
      checkServiceHealth(services.management),
      checkServiceHealth(services.retriever),
    ]);

    res.status(200).json({
      gateway: { status: "OK" },
      microservices: {
        management: managementHealth,
        retriever: retrieverHealth,
      },
    });
  } catch (error) {
    res.status(500).json({
      gateway: { status: "DOWN" },
      error: (error as Error).message,
    });
  }
});

export default healthcheckRouter;
