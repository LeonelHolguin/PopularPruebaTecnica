import amqp from "amqplib";
import jwt from "jsonwebtoken";
import { ProfileModel } from "../models/Profile";
import { Profile } from "../interfaces/Profile";

const RABBITMQ_URL = process.env.RABBITMQ_URL!;
const QUEUE_NAME = "profile-events";

const publicKeyManagement = process.env.MANAGEMENT_PUBLIC_KEY!;

export const consumeProfileEvents = async () => {
  const connection = await amqp.connect(RABBITMQ_URL);
  const channel = await connection.createChannel();

  await channel.assertQueue(QUEUE_NAME, { durable: true });

  console.log(`[RabbitMQ] Waiting for profile events...`);

  channel.consume(QUEUE_NAME, async (msg) => {
    if (msg) {
      try {
        const token = msg.content.toString();
        const data = jwt.verify(token, publicKeyManagement, {
          algorithms: ["RS256"],
          audience: process.env.JWT_AUDIENCE!,
          issuer: process.env.JWT_ISSUER!,
        }) as {
          profile: Profile;
          event: string;
          timestamp: string;
        };

        const { profile } = data;
        const profileId = profile._id;

        if (profileId) {
          try {
            const existingProfile = await ProfileModel.findById(profileId);

            if (existingProfile) {
              existingProfile.address = "From MQ in retriever-service";

              await existingProfile.save();

              console.log(`[Retriever] Profile updated with new address.`);
            } else {
              console.warn(
                `[Retriever] Profile not found with ID: ${profileId}`
              );

              channel.nack(msg, false, false);
            }

            channel.ack(msg);
          } catch (err) {
            console.error(
              `[Retriever] Error updating profile:`,
              (err as Error).message
            );

            channel.nack(msg, false, true);
          }
        }
      } catch (err) {
        console.error(
          `[RabbitMQ] Invalid profile_created event, ignoring.`,
          (err as Error).message
        );

        channel.nack(msg, false, false);
      }
    }
  });
};
