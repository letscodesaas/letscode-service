import type { Context } from "hono";

export class VideoController {
  public async healthcheck(c: Context) {
    c.status(200);
    return c.json({ message: "success" });
  }

  

}
