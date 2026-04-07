import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { MailTrapService } from "@letscode/services/service";
import {worker} from "./worker/worker.js"

import path from "node:path";
import { fileURLToPath } from "node:url";



const app = new Hono();
let TOTAL_SUBSCRIBER = 0;
const mailtrap = new MailTrapService("", true);

const _dirname = fileURLToPath(import.meta.url)
const thread_path = path.join(_dirname,"../","worker","thread.js") 


const result = worker(thread_path);
console.log(result)

app.get("/", (c) => {
  c.status(200);
  return c.json({ message: "healthy" });
});

app.post("/bulkmail", async (c) => {
  try {
    const data = await c.req.json();
    const {topic} = await data;

  } catch (error) {
    console.log(error);
    c.status(500);
    c.json({ message: "Internal Server Error" });
  }
});

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);
