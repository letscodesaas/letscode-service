import type { Context } from "hono";
import {
  Subscriber,
  Topics,
  NotificationEvent,
} from "@letscode/databases/models";
import { MailTrapService } from "@letscode/services/service";
import { ENV } from "../env/env.js";
import path from "node:path";
import {
  writeFileSync,
  existsSync,
  mkdirSync,
  unlink,
  createReadStream,
} from "node:fs";
import { fileURLToPath } from "node:url";
import csv from "csv-parser";

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

  public async uploadmails(c: Context) {
    try {
      const data = await c.req.formData();
      // @ts-ignore
      const topic = data.get("topic");
      const csv_file = data.get("csv_file") as File;
      const upload_path = path.join(
        fileURLToPath(import.meta.url),
        "../",
        "../",
        "uploads",
      );
      const check_folder_exists = existsSync(upload_path);
      if (!check_folder_exists) {
        mkdirSync(upload_path);
      }
      const buffer = await csv_file.arrayBuffer();
      const csv_data = Buffer.from(buffer);
      writeFileSync(`${upload_path}/upload.csv`, csv_data);
      await Topics.create({
        topic: topic,
      });
      createReadStream(`${upload_path}/upload.csv`)
        .pipe(csv())
        .on("data", async (row) => {
          await Subscriber.create({
            email: row.email,
            topic: topic,
          });
        })
        .on("error", (err) => {
          console.log(err);
          c.status(402)
          return c.json({message:'Failed to load the csv'})
        });
      unlink(`${upload_path}/upload.csv`, (err) => {
        console.log(err);
      });
      c.status(201);
      return c.json({ message: "success" });
    } catch (error) {
      console.log(error);
      c.status(500);
      return c.json({ message: "Internal Server Error" });
    }
  }
}
