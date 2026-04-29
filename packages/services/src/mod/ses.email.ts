import { SESClient,SendBulkTemplatedEmailCommand  } from "@aws-sdk/client-ses";

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
      const info = await client.send(config);
      return info;
    } catch (error) {
      throw new Error(String(error));
    }
  }

  public async sendBulkMails(input:any){
    try {
        const client = await this.sesclient();
        const command = new SendBulkTemplatedEmailCommand(input);
        const info = await client.send(command);
        return info;
    } catch (error) {
        throw new Error(String(error))
    }
  }
}




// const input = { // SendBulkTemplatedEmailRequest
//   Source: "STRING_VALUE", // required
//   SourceArn: "STRING_VALUE",
//   ReplyToAddresses: [ // AddressList
//     "STRING_VALUE",
//   ],
//   ReturnPath: "STRING_VALUE",
//   ReturnPathArn: "STRING_VALUE",
//   ConfigurationSetName: "STRING_VALUE",
//   DefaultTags: [ // MessageTagList
//     { // MessageTag
//       Name: "STRING_VALUE", // required
//       Value: "STRING_VALUE", // required
//     },
//   ],
//   Template: "STRING_VALUE", // required
//   TemplateArn: "STRING_VALUE",
//   DefaultTemplateData: "STRING_VALUE", // required
//   Destinations: [ // BulkEmailDestinationList // required
//     { // BulkEmailDestination
//       Destination: { // Destination
//         ToAddresses: [
//           "STRING_VALUE",
//         ],
//         CcAddresses: [
//           "STRING_VALUE",
//         ],
//         BccAddresses: [
//           "STRING_VALUE",
//         ],
//       },
//       ReplacementTags: [
//         {
//           Name: "STRING_VALUE", // required
//           Value: "STRING_VALUE", // required
//         },
//       ],
//       ReplacementTemplateData: "STRING_VALUE",
//     },
//   ],
// };