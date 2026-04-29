import { SESClient,SendEmailCommand   } from "@aws-sdk/client-ses";

export class SES {
  accessKey: string;
  secretKey: string;
  constructor(accesskey: string, secretkey: string) {
    this.accessKey = accesskey;
    this.secretKey = secretkey;
  }

  private async sesclient() {
    try {
      const client = new SESClient({
        region: "ap-south-1",
        credentials: {
          accessKeyId: this.accessKey,
          secretAccessKey: this.secretKey,
        },
      });
      return client;
    } catch (error) {
      throw new Error(String(error));
    }
  }

  public async sendMails(config: any) {
    try {
      const client = await this.sesclient();
      const command = new SendEmailCommand(config)
      const info = await client.send(command);
      return info;
    } catch (error) {
      throw new Error(String(error));
    }
  }
}