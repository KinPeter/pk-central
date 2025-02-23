import { createTransport } from 'nodemailer';
import { DataBackup } from '../../common';
import { EmailManager } from './email-manager';
import { EmailUtils } from './email-utils';
import { getEnv } from './environment';

class EmailData {
  public from: string;
  constructor(
    public to: string,
    public subject: string,
    public text: string,
    public html: string,
    public attachments?: { filename: string; content: string }[]
  ) {
    const [EMAIL_USER] = getEnv('EMAIL_USER');
    this.from = `"P-Kin.com" <${EMAIL_USER}>`;
  }
}

export type TransportCreatorFn = typeof createTransport;

export class NodeMailerManager extends EmailUtils implements EmailManager {
  private readonly notificationEmail: string;
  private readonly host: string;
  private readonly user: string;
  private readonly pass: string;

  constructor(private createTransport: TransportCreatorFn) {
    super();
    const [EMAIL_USER, EMAIL_HOST, EMAIL_PASS, NOTIFICATION_EMAIL] = getEnv(
      'EMAIL_USER',
      'EMAIL_HOST',
      'EMAIL_PASS',
      'NOTIFICATION_EMAIL'
    );
    this.notificationEmail = NOTIFICATION_EMAIL;
    this.host = EMAIL_HOST;
    this.user = EMAIL_USER;
    this.pass = EMAIL_PASS;
  }

  public async sendLoginCode(email: string, loginCode: string): Promise<any> {
    const subject = `${loginCode} - Log in to PK-Central`;
    const { html, text } = this.getLoginCodeTemplates(loginCode);
    const data = new EmailData(email, subject, text, html);
    return await this.sendMail(data);
  }

  public async sendSignupNotification(email: string) {
    const subject = 'A user signed up to PK-Central';
    const { html, text } = this.getSignupNotificationTemplates(email);
    const data = new EmailData(this.notificationEmail ?? '', subject, text, html);
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
        host: this.host,
        port: 465,
        secure: true,
        auth: {
          user: this.user,
          pass: this.pass,
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
