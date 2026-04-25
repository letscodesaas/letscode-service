import { QueueEvents } from "bullmq";
import { Redis } from "ioredis";

export class QueueEventProcess {
  qname: string;
  redisuri: string;
  constructor(qname: string, redisuri: string) {
    this.qname = qname;
    this.redisuri = redisuri;
  }

  private async connection() {
    const connect = new Redis(this.redisuri, {
      maxRetriesPerRequest: null,
    });
    return connect;
  }

  private async initQueue() {
    const connectionObj = await this.connection();
    const _q = new QueueEvents(this.qname, {
      connection: connectionObj,
    });

    return _q;
  }

  public async processEvents() {
    const qEvent = await this.initQueue();
    return await new Promise((resolve, _reject) => {
      qEvent.on("waiting", ({ jobId }: { jobId: string }) => {
        resolve(`A job with ID ${jobId} is waiting`);
      });

      qEvent.on(
        "active",
        ({ jobId, prev }: { jobId: string; prev?: string }) => {
          resolve(`Job ${jobId} is now active; previous status was ${prev}`);
        },
      );

      qEvent.on(
        "completed",
        ({ jobId, returnvalue }: { jobId: string; returnvalue: string }) => {
          resolve(`${jobId} has completed and returned ${returnvalue}`);
        },
      );

      qEvent.on(
        "failed",
        ({ jobId, failedReason }: { jobId: string; failedReason: string }) => {
          resolve(`${jobId} has failed with reason ${failedReason}`);
        },
      );
    });
  }
}
