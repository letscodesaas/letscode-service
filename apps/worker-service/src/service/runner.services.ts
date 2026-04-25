import { MailTrapService } from "@letscode/services/service";
import { connection, NotificationStatus } from "@letscode/databases/models";
import { ENV } from "../env/env.js";

const mailTrap = new MailTrapService(
  ENV.MAILTRAP_TOKEN,
  true,
  parseInt(ENV.ACCOUNT_ID) as number,
);

const delay = async () => {
  return new Promise((r) => setTimeout(r, 2000));
};

export const runner = async (job: any) => {
  try {
    const sender = {
      email: "hello@www.lets-code.co.in",
      name: "Lets Code",
    };
    await connection(ENV.DB_URI);
    if (job.data.data) {
      const email = await job?.data?.data?.email?.email;
      if (!email) return;
      const topic = await job?.data?.data?.topic;
      const html = await job?.data?.data?.html;
      const category = await job?.data?.data?.category;
      const subject = await job?.data?.data?.subject;
      const topic_stamp = await job?.data?.data?.topic_stamp;

      await delay();
      const message = await mailTrap.sendBulkMails({
        from: sender,
        // @ts-ignore
        to: [{ email: email }],
        category: category,
        subject: subject,
        html: html,
      });
      if (message.success) {
        await NotificationStatus.create({
          topic: topic_stamp,
          email: email,
          status: "DONE",
        });
        console.log(message.success);
      }
    }
  } catch (error) {
    console.log(error);
    throw new Error(String(error));
  }
};
