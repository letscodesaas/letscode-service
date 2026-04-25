import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { router } from "./routes/routes.js";
import { connection } from "@letscode/databases/models";
import { ENV } from "./env/env.js";

const app = new Hono();

app.get("/", (c) => {
  c.status(200);
  return c.json({ message: "health" });
});

app.route("/api/v1", router);

connection(ENV.DB)
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
