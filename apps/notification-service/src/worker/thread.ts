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

      const info = await mailtrap.sendBulkMails({
        from: sender,
        // @ts-ignore
        to: [{ email: "letscode@letscode.co.in" }],
        category: category,
        subject: subject,
        html: html,
        bcc:subscriber.map(u => ({ email: u.email }))
      });
      console.log(info)
    parentPort?.postMessage("done");
    return;
  } catch (error) {
    throw new Error(String(error));
  }
};

process_emails();
