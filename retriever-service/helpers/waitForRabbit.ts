import amqp from "amqplib";

const RETRY_INTERVAL = 6000;
const MAX_RETRIES = 10;

export const waitForRabbit = async (url: string) => {
  let retries = 0;

  while (retries < MAX_RETRIES) {
    try {
      const conn = await amqp.connect(url);
      await conn.close();
      console.log("[RabbitMQ] Connection established.");
      return;
    } catch (error) {
      retries++;
      console.log(
        `[RabbitMQ] Connection failed, retrying (${retries}/${MAX_RETRIES})...`
      );
      await new Promise((resolve) => setTimeout(resolve, RETRY_INTERVAL));
    }
  }

  throw new Error("[RabbitMQ] Could not connect after maximum retries.");
};
