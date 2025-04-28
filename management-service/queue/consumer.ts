import amqp from "amqplib";
import jwt from "jsonwebtoken";
import { SessionModel } from "../models/Session";

const publicKeyRetriever = process.env.RETRIEVER_PUBLIC_KEY!;
const RABBITMQ_URL = process.env.RABBITMQ_URL!;
const QUEUE_NAME = "user-events";

export const consumeUserEvents = async () => {
  const connection = await amqp.connect(RABBITMQ_URL);
  const channel = await connection.createChannel();

  await channel.assertQueue(QUEUE_NAME, { durable: true });

  console.log(`[RabbitMQ] Waiting for user events...`);

  channel.consume(QUEUE_NAME, async (msg) => {
    if (msg) {
      try {
        const token = msg.content.toString();
        const payload = jwt.verify(token, publicKeyRetriever, {
          algorithms: ["RS256"],
          audience: process.env.JWT_AUDIENCE!,
          issuer: process.env.JWT_ISSUER!,
        }) as { username: string };

        const session = new SessionModel({
          username: payload.username,
          loginTime: new Date(),
        });

        await session.save();

        console.log(`[RabbitMQ] Verified user_logged_in event.`);

        channel.ack(msg);
      } catch (err) {
        console.error(
          "[RabbitMQ] Invalid or untrusted user event received, discarding.",
          (err as Error).message
        );

        channel.nack(msg, false, false);
      }
    }
  });
};
