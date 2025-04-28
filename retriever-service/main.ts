import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import fs from "fs";
import path from "path";
import https from "https";
import { corsOptions } from "./config/cors";

dotenv.config();

import router from "./routes";
import { connectDB } from "./database";
import { consumeProfileEvents } from "./queue/consumer";
import { waitForRabbit } from "./helpers/waitForRabbit";

const app = express();
const PORT = process.env.PORT || 3002;

const sslOptions = {
  key: fs.readFileSync(path.resolve(__dirname, "../certs/key.pem")),
  cert: fs.readFileSync(path.resolve(__dirname, "../certs/cert.pem")),
  secureProtocol: "TLSv1_2_method",
};

app.use(corsOptions);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/", router);

connectDB();
(async () => {
  await waitForRabbit(process.env.RABBITMQ_URL!);
  consumeProfileEvents();
  https.createServer(sslOptions, app).listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
})();
