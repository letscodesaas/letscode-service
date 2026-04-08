import type { Context } from "hono";
import {
  Subscriber,
  Topics,
  NotificationEvent,
} from "@letscode/databases/models";
import { MailTrapService } from "@letscode/services/service";
import { ENV } from "../env/env.js";

export class NotificationController {
  public async subscribe(c: Context) {
    try {
      const data = await c.req.json();
      const { email, topic } = data;
      await Subscriber.create({
        email: email,
        topic: topic,
      });
      c.status(201);
      return c.json({ message: "success" });
    } catch (error) {
      console.log(error);
      c.status(500);
      return c.json({ message: "Internal Server Error" });
    }
  }

  public async unsubscribe(c: Context) {
    try {
      const data = await c.req.json();
      const { email } = data;

      await Subscriber.findOneAndUpdate(
        {
          // @ts-ignore
          email: email,
        },
        {
          isSubscribed: false,
        },
        {},
      );
      c.status(200);
      return c.json({ message: "success" });
    } catch (error) {
      console.log(error);
      c.status(500);
      return c.json({ message: "Internal Server Error" });
    }
  }

  public async createTopic(c: Context) {
    try {
      const data = await c.req.json();
      const { topic } = await data;
      await Topics.create({
        topic,
      });
      c.status(201);
      return c.json({ message: "success" });
    } catch (error) {
      console.log(error);
      c.status(500);
      return c.json({ message: "Internal Server Error" });
    }
  }

  public async topics(c: Context) {
    try {
      const response = await Topics.find();
      c.status(201);
      return c.json({ message: "success", data: response });
    } catch (error) {
      console.log(error);
      c.status(500);
      return c.json({ message: "Internal Server Error" });
    }
  }

  public async deleteTopics(c: Context) {
    try {
      const data = c.req.param;
      //   @ts-ignore
      await Topics.findByIdAndDelete(data?.id);
      c.status(200);
      return c.json({ message: "success" });
    } catch (error) {
      console.log(error);
      c.status(500);
      return c.json({ message: "Internal Server Error" });
    }
  }

  public async bulkMail(c: Context) {
    try {
      const mailtrap = new MailTrapService(ENV.MAILTRAP_TOKEN, true);
      const data = await c.req.json();
      const { topic, html, category, subject } = await data;
      const subscriber = await Subscriber.find({
        // @ts-ignore
        topic: topic,
        isSubscribed: true,
      }).select("email");

      if (!subscriber || subscriber.length !== 0) {
        c.status(200);
        return c.json({ message: "No Subscribers" });
      }
      const FROM = {
        name: "letscode@lets-code.co.in",
      };
      await mailtrap.sendBulkMails({
        from: FROM.name,
        // @ts-ignore
        to: subscriber,
        category: category,
        subject: subject,
        html: html,
      });
      c.status(200);
      return c.json({ message: "success" });
    } catch (error) {
      console.log(error);
      c.status(500);
      return c.json({ message: "Internal Server Error" });
    }
  }

  public async scheduleNotification(c: Context) {
    try {
      const data = await c.req.json();
      const { topic } = data;
      await NotificationEvent.create({
        topic: topic,
        scheduled: true,
      });
      c.status(200);
      return c.json({ message: "success" });
    } catch (error) {
      console.log(error);
      c.status(500);
      return c.json({ message: "Internal Server Error" });
    }
  }

  public async scheduleNotifications(c: Context) {
    try {
      const data = await NotificationEvent.find().sort({
        createdAt: -1,
      });
      c.status(200);
      return c.json({ message: "success", data: data });
    } catch (error) {
      console.log(error);
      c.status(500);
      return c.json({ message: "Internal Server Error" });
    }
  }
}
