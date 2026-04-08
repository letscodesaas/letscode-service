import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { worker } from "./worker/worker.js";
import { router } from "./routes/routes.js";
import { connection } from "@letscode/databases/models";
import { ENV } from "./env/env.js";

import path from "node:path";
import { fileURLToPath } from "node:url";

const app = new Hono();


const _dirname = fileURLToPath(import.meta.url);
const thread_path = path.join(_dirname, "../", "worker", "thread.js");

const result = worker(thread_path);
result
  .then((d) => {
    console.log(d);
  })
  .catch((e) => {
    console.log(e);
  });

app.get("/", (c) => {
  c.status(200);
  return c.json({ message: "healthy" });
});

app.mount("/api/v1", router.fetch);

connection(ENV.DB_URI)
  .then(() => {
    serve(
      {
        fetch: app.fetch,
        port: 3000,
      },
      (info) => {
        console.log(`Server is running on http://localhost:${info.port}`);
      },
    );
  })
  .catch((e) => {
    console.log(e);
  });
