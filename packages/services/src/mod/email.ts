import { MailtrapClient } from "mailtrap";

export class MailTrapService extends MailtrapClient {
  constructor(token: string, bulkoption: boolean, accountId: number) {
    super({
      token: token,
      bulk: bulkoption,
      accountId: accountId,
    });
  }

  /**
   * send emails
   */
  public async sendEmail({
    from,
    name,
    to,
    subject,
    html,
  }: {
    from: string;
    name: string;
    to: string;
    subject: string;
    html: string;
  }) {
    try {
      const response = await this.send({
        from: {
          email: from,
          name: name,
        },
        to: [{ email: to }],
        subject,
        html,
      });
      return response;
    } catch (error) {
      throw new Error(String(error));
    }
  }

  /**
   * sendBulkMails
   */
  public async sendBulkMails({
    from,
    to,
    subject,
    html,
    category,
    bcc
  }: {
    from: any;
    to: [
      {
        email: string;
      },
    ];
    subject: string;
    html: string;
    category: string;
    bcc:any
  }) {
    try {
      const response = await this.send({
        from: from,
        to: to,
        subject: subject,
        html: html,
        category: category,
        bcc:bcc
      });
      return response;
    } catch (error) {
      throw new Error(String(error));
    }
  }

  public async sendStats(param: Record<string, unknown>): Promise<unknown> {
    try {
      const response = await this.stats.get(param as any);
      return response;
    } catch (error) {
      throw new Error(String(error));
    }
  }
}
