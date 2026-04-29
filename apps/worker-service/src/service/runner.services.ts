import { SES } from "@letscode/services/service";
import { connection, NotificationStatus } from "@letscode/databases/models";
import { ENV } from "../env/env.js";

const sesClient = new SES(ENV.ACCESS_KEY, ENV.SECRET_KEY);

export const runner = async (job: any) => {
  try {
    const sender = {
      email: "letscode@lets-code.co.in",
      name: "Lets Code",
    };

    await connection(ENV.DB_URI);
    if (job.data.data) {
      const email = await job?.data?.data?.email;
      if (!email) return;
      const html = await job?.data?.data?.html;
      const subject = await job?.data?.data?.subject;
      const MAX = 14;
      let e = [];
      let START = 0;
      let STOP = 0;
      let COUNT = 0;
      while (COUNT < email.length) {
        if (email.length < MAX) {
          let v = email.slice(START, email.length + 1);
          e = [...v];
          for (const emails of e) {
            const info = await sesClient.sendMails({
              Source: sender.email,
              Destination: { ToAddresses: [emails] },
              Message: {
                Subject: {
                  Data: subject,
                },
                Body: {
                  Html: { Data: html },
                },
              },
            });
            await NotificationStatus.create({
              topic: info.MessageId,
              email: emails,
              status: info.$metadata.httpStatusCode,
            });
            console.log(info);
            await new Promise((r)=>setTimeout(r,2000))
          }
          break;
        } else {
          STOP = STOP + MAX;
          let v = email.slice(START, STOP);
          e = [...v];
          for (const emails of e) {
            const info = await sesClient.sendMails({
              Source: sender.email,
              Destination: { ToAddresses: emails },
              Message: {
                Subject: {
                  Data: subject,
                },
                Body: {
                  Html: { Data: html },
                },
              },
            });
            await NotificationStatus.create({
              topic: info.MessageId,
              email: emails,
              status: info.$metadata.httpStatusCode,
            });
            console.log(info);
            await new Promise((r)=>setTimeout(r,2000))
          }
          START = STOP;
          COUNT += MAX;
          e = [];
          await new Promise((r) => setTimeout(r, 2000));
        }
      }
    }
  } catch (error) {
    console.log(error);
    throw new Error(String(error));
  }
};
