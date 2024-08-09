import { createTransport } from 'nodemailer';
import { DataBackup } from 'pk-common';
import { EmailManager } from './email-manager';
import { EmailUtils } from './email-utils';

class EmailData {
  public from = `"P-Kin.com" <${process.env.EMAIL_USER}>`;
  constructor(
    public to: string,
    public subject: string,
    public text: string,
    public html: string,
    public attachments?: { filename: string; content: string }[]
  ) {}
}

export type TransportCreatorFn = typeof createTransport;

export class NodeMailerManager extends EmailUtils implements EmailManager {
  constructor(private createTransport: TransportCreatorFn) {
    super();
  }

  public async sendLoginCode(email: string, loginCode: string, magicLinkToken: string): Promise<any> {
    const subject = `${loginCode} - Log in to PK-Central`;
    const { html, text } = this.getLoginCodeTemplates(loginCode, magicLinkToken);
    const data = new EmailData(email, subject, text, html);
    return await this.sendMail(data);
  }

  public async sendSignupNotification(email: string) {
    const subject = 'A user signed up to PK-Central';
    const { html, text } = this.getSignupNotificationTemplates(email);
    const data = new EmailData(process.env.NOTIFICATION_EMAIL ?? '', subject, text, html);
    return await this.sendMail(data);
  }

  public async sendDataBackup(name: string, email: string, backup: DataBackup): Promise<any> {
    const now = new Date();
    const date = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
    const subject = `Data backup for PK Central`;
    const { html, text } = this.getDataBackupTemplates(name);
    const backupFile = {
      filename: `pk-central-backup-${date}.json`,
      content: JSON.stringify(backup, null, 2),
    };
    const data = new EmailData(email, subject, text, html, [backupFile]);
    return await this.sendMail(data);
  }

  private async sendMail(emailData: EmailData): Promise<any> {
    try {
      const transporter = this.createTransport({
        host: process.env.EMAIL_HOST,
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
        tls: {
          rejectUnauthorized: false,
        },
      });
      console.log(`Sending email to ${emailData.to}`);
      return await transporter.sendMail(emailData);
    } catch (error: any) {
      console.error('Error in sendMail:');
      console.error(error);
      throw new Error(`Unable to send email: ${error.message}`);
    }
  }
}
