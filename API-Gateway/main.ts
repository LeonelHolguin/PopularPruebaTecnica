import dotenv from "dotenv";
import express from "express";
import fs from "fs";
import path from "path";
import https from "https";
import { createProxyMiddleware } from "http-proxy-middleware";
import { corsOptions } from "./config/cors";
dotenv.config();

import router from "./routes";

const PORT = process.env.PORT || 8080;
const app = express();

app.use(
  "/management",
  createProxyMiddleware({
    target: process.env.MANAGEMENT_URL!,
    changeOrigin: true,
    pathRewrite: { "^/management": "" },
    secure: false,
  })
);

app.use(
  "/retriever",
  createProxyMiddleware({
    target: process.env.RETRIEVER_URL!,
    changeOrigin: true,
    pathRewrite: { "^/retriever": "" },
    secure: false,
  })
);

app.use(corsOptions);
app.use("/", router);

const sslOptions = {
  key: fs.readFileSync(path.resolve(__dirname, "../certs/key.pem")),
  cert: fs.readFileSync(path.resolve(__dirname, "../certs/cert.pem")),
  secureProtocol: "TLSv1_2_method",
};

https.createServer(sslOptions, app).listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
