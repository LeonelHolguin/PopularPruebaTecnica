import amqp from "amqplib";
import jwt from "jsonwebtoken";
import { Profile } from "../interfaces/Profile";

const RABBITMQ_URL = process.env.RABBITMQ_URL!;
const QUEUE_NAME = "profile-events";

const privateKey = process.env.PRIVATE_KEY!;

export const publishProfileCreated = async (profile: Profile) => {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();

    await channel.assertQueue(QUEUE_NAME, { durable: true });

    const payload = {
      profile,
      event: "profile_created",
      timestamp: new Date().toISOString(),
    };

    const token = jwt.sign(payload, privateKey, {
      algorithm: "RS256",
      expiresIn: "5m",
      audience: process.env.JWT_AUDIENCE!,
      issuer: process.env.JWT_ISSUER!,
    });

    channel.sendToQueue(QUEUE_NAME, Buffer.from(token));

    console.log(`[RabbitMQ] Sent signed profile_created event.`);

    await channel.close();
    await connection.close();
  } catch (error) {
    console.error("[RabbitMQ] Error publishing profile_created event:", error);
  }
};
