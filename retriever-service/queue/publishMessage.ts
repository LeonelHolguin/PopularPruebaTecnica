import amqp from "amqplib";
import jwt from "jsonwebtoken";

const privateKey = process.env.PRIVATE_KEY!;
const RABBITMQ_URL = process.env.RABBITMQ_URL!;
const QUEUE_NAME = "user-events";

export const publishUserLoggedIn = async (username: string) => {
  const connection = await amqp.connect(RABBITMQ_URL);
  const channel = await connection.createChannel();

  await channel.assertQueue(QUEUE_NAME, { durable: true });

  const payload = { username };
  const token = jwt.sign(payload, privateKey, {
    algorithm: "RS256",
    expiresIn: "5m",
    audience: process.env.JWT_AUDIENCE!,
    issuer: process.env.JWT_ISSUER!,
  });

  channel.sendToQueue(QUEUE_NAME, Buffer.from(token));

  await channel.close();
  await connection.close();
};
