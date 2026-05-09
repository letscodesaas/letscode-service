import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { router } from "./routes/routes.js";
import { connection } from "@letscode/databases/models";
import { ENV } from "./env/env.js";
import { cors } from "hono/cors";

const app = new Hono();

app.use(
  "*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  }),
);

app.get("/", (c) => {
  c.status(200);
  return c.json({ message: "healthy" });
});

app.route("/api/v1", router);

if (ENV.DEV === "dev") {
  connection(ENV.DB_URI)
    .then(() => {
      serve(
        {
          fetch: app.fetch,
          port: parseInt(ENV.PORT),
        },
        (info) => {
          console.log(`Server is running on http://localhost:${info.port}`);
        },
      );
    })
    .catch((e) => {
      console.log(e);
    });
}

export default app;