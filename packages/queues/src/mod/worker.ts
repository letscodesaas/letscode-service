import { Redis } from "ioredis";
import { Job, Worker } from "bullmq";

export class WorkerInstance {
  private redisuri: string;
  private qname: string;
  constructor(uri: string, qname: string) {
    this.redisuri = uri;
    this.qname = qname;
  }
  private async connection() {
    const connect = new Redis(this.redisuri, { maxRetriesPerRequest: null });
    return connect;
  }
  public async worker(cb: (job: Job) => Promise<void> | void): Promise<Worker> {
    const connnection_obj = await this.connection();
    const _w = new Worker(
      this.qname,
      async (job:any) => {
        await cb(job);
      },
      {
        connection: connnection_obj,
        removeOnComplete: { count: 0 },
        removeOnFail: { count: 0 },
      },
    );
    return _w;
  }
}