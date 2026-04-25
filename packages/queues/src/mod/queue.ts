import { Redis } from "ioredis";
import { Queue } from "bullmq";

export class QueueInstance {
  private redisuri: string;
  private qname: string;
  constructor(uri: string, qname: string) {
    this.redisuri = uri;
    this.qname = qname;
  }

  private async connection() {
    const connect = new Redis(this.redisuri, {
      maxRetriesPerRequest: null,
    });
    return connect;
  }
  public async initalQueue() {
    const connectionObj = await this.connection();
    const queue = new Queue(this.qname, {
      connection: connectionObj,
    });
    await queue.setGlobalRateLimit(1, 4000);
    return queue;
  }
  public async addJob(name: string, data: any) {
    const queue = await this.initalQueue();
    await queue.add(
      name,
      { data },
      { removeOnComplete: true, removeOnFail: true },
    );
  }
}