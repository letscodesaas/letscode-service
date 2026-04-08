import {
  NotificationEvent,
  Subscriber,
  EmailContent,
} from "@letscode/databases/models";
import { MailTrapService } from "@letscode/services/service";
import { ENV } from "../env/env.js";

const mailtrap = new MailTrapService(ENV.MAILTRAP_TOKEN, true);

export class NotificationService {
  public async notify() {
    try {
      const notifiction_config = await NotificationEvent.findOne({
        // @ts-ignore
        topic: "",
      });
      if (notifiction_config.scheduled === false) {
        return;
      }
      const subscribers = await Subscriber.find({
        // @ts-ignore
        topic: "contest",
      })
        .select("email")
        .sort({
          subscribe: 1,
        });

      if (!subscribers || subscribers.length === 0) {
        return;
      }
      const email_content = await EmailContent.findOne({
        // @ts-ignore
        topic: "",
      });
      if (!email_content) {
        return;
      }

      await mailtrap.sendBulkMails({
        from: "letscode",
        // @ts-ignore
        to: subscribers,
        subject: email_content.subject,
        html: email_content.html,
        category: email_content.category,
      });
    } catch (error) {
      throw new Error(String(error));
    }
  }
}
