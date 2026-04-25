import { WorkerInstance } from "@letscode/queues/queues";
import { ENV } from "./env/env.js";
import { runner } from "./service/runner.services.js";

const _worker = new WorkerInstance(ENV.REDIS_URL, "notification-queue");
_worker
  .worker(runner)
  .then((d) => {
    console.log("worker started");
  })
  .catch((e) => {
    console.log(e);
  });
