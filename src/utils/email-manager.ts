import { createTransport } from 'nodemailer';
import { DataBackup } from 'pk-common';

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

interface EmailTemplates {
  html: string;
  text: string;
}

type TransportCreatorFn = typeof createTransport;

export class EmailManager {
  constructor(private createTransport: TransportCreatorFn) {}

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

  private getLoginCodeTemplates(loginCode: string, magicLinkToken: string): EmailTemplates {
    const expiresInMinutes = Number(process.env.LOGIN_CODE_EXPIRY);
    const prodProdMagicLink = `${process.env.SELF_URL}/auth/verify-link/${magicLinkToken}/prod`;
    const localLocalMagicLink = `http://localhost:8888/auth/verify-link/${magicLinkToken}/dev`;
    const prodLocalMagicLink = `${process.env.SELF_URL}/auth/verify-link/${magicLinkToken}/dev`;
    const html = `
    <h3>Hello!</h3>
    <p>Please use the code below to log in, it expires in ${expiresInMinutes} minutes.</p>
    <h1>${loginCode}</h1>
    <p>Or, use the <a href="${prodProdMagicLink}">magic link</a>!</p>
    <p>[DEV local] <a href="${localLocalMagicLink}">magic link</a>!</p>
    <p>[DEV prod/local] <a href="${prodLocalMagicLink}">magic link</a>!</p>
    `;
    const text = `
    Hello!
    Your code to log in: ${loginCode}.
    You can use it within the next ${expiresInMinutes} minutes.
    `;
    return { html, text };
  }

  private getSignupNotificationTemplates(email: string) {
    const html = `
    <h3>Hey Peter!</h3>
    <p>A user just signed up to PK-Central:</p>
    <p>Email: ${email}</p>
    `;
    const text = `
    Hey Peter!
    A user just signed up to PK-Central:
    Email: ${email}
    `;
    return { html, text };
  }

  private getDataBackupTemplates(name: string) {
    const html = `
    <h3>Hey ${name}!</h3>
    <p>As requested, please find attached the backup file of your data.</p>
    `;
    const text = `
    Hey ${name}!
    As requested, please find attached the backup file of your data.
    `;
    return { html, text };
  }
}
