import { MailTrapService } from "@letscode/services/service";
import { connection, NotificationStatus } from "@letscode/databases/models";
import { ENV } from "../env/env.js";

const mailTrap = new MailTrapService(
  ENV.MAILTRAP_TOKEN,
  true,
  parseInt(ENV.ACCOUNT_ID) as number,
);

export const runner = async (job: any) => {
  try {
    const sender = {
      email: "hello@www.lets-code.co.in",
      name: "Lets Code",
    };
    await connection(ENV.DB_URI);
    if (job.data.data) {
      const email = await job?.data?.data?.email;
      if (!email) return;
      const topic = await job?.data?.data?.topic;
      const html = await job?.data?.data?.html;
      const category = await job?.data?.data?.category;
      const subject = await job?.data?.data?.subject;
      const topic_stamp = await job?.data?.data?.topic_stamp;
      const MAX = 500;
      let e = [];
      let START = 0;
      let STOP = 0;
      let COUNT = 0;

      while (COUNT < email.length) {
        if (email.length < MAX) {
          let v = email.slice(START, email.length + 1);
          e = [...v];
          const info = await mailTrap.sendBatch(sender.email,subject,html,e);
          console.log(info)
          break;
        } else {
          STOP = STOP + MAX;
          let v = email.slice(START, STOP);
          e = [...v];
          await new Promise((r) => setTimeout(r, 5000));
          const info = await mailTrap.sendBatch(sender.email,subject,html,e);
          console.log(info)
          START = STOP;
          COUNT += MAX;
          e = [];
        }
      }
    }
  } catch (error) {
    console.log(error);
    throw new Error(String(error));
  }
};
