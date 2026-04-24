import type { Context } from "hono";
import {
  Subscriber,
  Topics,
  NotificationEvent,
  EmailContent,
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
import { worker } from "../worker/worker.js";

const workerPath = path.join(
  fileURLToPath(import.meta.url),
  "..",
  "..",
  "worker",
  "thread.js",
);

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
      const response = [];
      const topics = await Topics.find();

      for (const s of topics) {
        const subscribe = await Subscriber.find({
          // @ts-ignore
          topic: s.topic as string,
          isSubscribed: true,
        });
        response.push({
          topics: s,
          subscribers: subscribe.length,
        });
      }
      c.status(200);
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
      const data = await c.req.json();
      const { topic, html, category, subject } = await data;
      if (!topic || !html || !category || !subject) {
        c.status(402);
        return c.json({
          message: "Html, category, subject, topic is required",
        });
      }
      const _w = await worker(workerPath, data);
      console.log(_w);
      if (_w !== "done") {
        c.status(402);
        return c.json({ message: "something went wrong" });
      }
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

      await new Promise((resolve, reject) => {
        createReadStream(`${upload_path}/upload.csv`)
          .pipe(csv())
          .on("data", async (row) => {
            const email = row.email?.trim();
            if (!email) return;
            const is_email_exists = await Subscriber.findOne({
              // @ts-ignore
              email: row.email,
            });
            if (is_email_exists) return;
            await Subscriber.create({
              email: row.email,
              topic: topic,
            });
          })
          .on("error", reject)
          .on("end", resolve);
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

  public async uploadExistingmails(c: Context) {
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
      const is_topic_exists = await Topics.findOne({
        // @ts-ignore
        topic: topic,
      });

      if (!is_topic_exists) {
        c.status(404);
        return c.json({ message: "topic not exists" });
      }

      await new Promise((resolve, reject) => {
        createReadStream(`${upload_path}/upload.csv`)
          .pipe(csv())
          .on("data", async (row) => {
            const email = row.email?.trim();
            if (!email) return;
            const is_email_exists = await Subscriber.findOne({
              // @ts-ignore
              email: email,
              topic:topic
            });
            if (!is_email_exists) {
              await Subscriber.create({
                email: email,
                topic: topic,
              });
            }
          })
          .on("error", reject)
          .on("end", resolve);
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

  public async stats(c: Context) {
    try {
      const mailtrap = new MailTrapService(
        ENV.MAILTRAP_TOKEN,
        false,
        parseInt(ENV.ACCOUNT_ID),
      );
      const datainfo = await c.req.json();
      const params = {
        ...datainfo,
      };
      const data = await mailtrap.sendStats(params);
      c.status(200);
      return c.json({ message: "success", data: data });
    } catch (error) {
      console.log(error);
      c.status(500);
      return c.json({ message: "Internal Server Error" });
    }
  }

  public async pushEventsAPI(c: Context) {
    try {
      const data = await c.req.json();
      console.log(data);
      c.status(200);
      return c.json({ message: "success" });
    } catch (error) {
      console.log(error);
      c.status(500);
      return c.json({ message: "Internal Server Error" });
    }
  }

  public async managemail(c: Context) {
    try {
      const data = await c.req.json();
      const { subject, category, html, topic } = data;
      await EmailContent.create({
        subject,
        category,
        html,
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

  public async managemails(c: Context) {
    try {
      const data = c.req.param("topic");
      if (data === "all") {
        const response = await EmailContent.find().sort({
          createdAt: -1,
        });
        c.status(200);
        return c.json({ message: "success", data: response });
      }
      const response = await EmailContent.find({
        // @ts-ignore
        topic: data,
      }).sort({
        createdAt: -1,
      });
      c.status(200);
      return c.json({ message: "success", data: response });
    } catch (error) {
      console.log(error);
      c.status(500);
      return c.json({ message: "Internal Server Error" });
    }
  }
}
