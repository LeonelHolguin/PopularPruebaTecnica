import axios from "axios";

const SLOW_THRESHOLD_MS = 500;

export const checkServiceHealth = async (url: string) => {
  const start = Date.now();

  try {
    await axios.get(url, {
      timeout: 2000,
      httpsAgent: new (require("https").Agent)({
        rejectUnauthorized: false,
      }),
    });
    const responseTime = Date.now() - start;

    return {
      status: responseTime > SLOW_THRESHOLD_MS ? "SLOW" : "OK",
      responseTime,
    };
  } catch (error) {
    const responseTime = Date.now() - start;
    return {
      status: "DOWN",
      responseTime,
    };
  }
};
