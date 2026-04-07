import { MailtrapClient } from "mailtrap";

export class MailTrapService extends MailtrapClient {
  constructor(token: string, bulkoption: boolean) {
    super({
      token: token,
      bulk: bulkoption,
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
  }: {
    from: string;
    to: [
      {
        email: string;
      },
    ];
    subject: string;
    html: string;
    category: string;
  }) {
    try {
      const response = await this.send({
        from: {
          email: from,
        },
        to: to,
        subject: subject,
        html: html,
        category: category,
      });
      return response;
    } catch (error) {
      throw new Error(String(error));
    }
  }
}
