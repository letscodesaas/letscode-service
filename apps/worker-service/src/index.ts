import { WorkerInstance } from "@letscode/queues/queues";
import os from "node:os";
import cluster from "node:cluster";
import { ENV } from "./env/env.js";
import { runner } from "./service/runner.services.js";

const CPUS = os.cpus().length;

if (cluster.isPrimary) {
  for (let index = 0; index < CPUS; index++) {
    cluster.fork();
  }
  cluster.on("exit", (worker:any, code:any, signal:any) => {
    console.log(`Worker ${worker.process.pid} died. Restarting...`);
    cluster.fork();
  });
} else {
  console.log("worker is running....");
  const _worker = new WorkerInstance(ENV.REDIS_URL, "notification-queue");
  _worker
    .worker(runner)
    .then((d) => {
      console.log("worker started");
    })
    .catch((e) => {
      console.log(e);
    });
}
