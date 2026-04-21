import { parentPort, workerData } from "worker_threads";
import { MailTrapService } from "@letscode/services/service";
import { ENV } from "../env/env.js";
import { Subscriber,connection } from "@letscode/databases/models";

export const process_emails = async () => {
  try {
    await connection(ENV.DB_URI);
    const mailtrap = new MailTrapService(
      ENV.MAILTRAP_TOKEN,
      true,
      parseInt(ENV.ACCOUNT_ID),
    );
    const data = await workerData;
    const { topic, html, category, subject } = await data;
    const subscriber = await Subscriber.find({
      // @ts-ignore
      topic: topic,
      isSubscribed: true,
    }).select("email -_id");

    if (!subscriber || subscriber.length === 0) {
      return;
    }
    const sender = {
      email: "hello@www.lets-code.co.in",
      name: "Lets Code",
    };

    for (const s of subscriber) {
      const info = await mailtrap.sendBulkMails({
        from: sender,
        // @ts-ignore
        to: [{ email: s.email }],
        category: category,
        subject: subject,
        html: html,
      });
      await new Promise((resolve) => setTimeout(resolve, 4000));
    }
    parentPort?.postMessage("done");
    return;
  } catch (error) {
    throw new Error(String(error));
  }
};

process_emails();
