import { EmailManager } from './email-manager';
import { DataBackup } from 'pk-common';
import { EmailUtils } from './email-utils';
import { HttpClient } from './http-client';

class EmailData {
  public apiKey = process.env.MAILER_API_KEY;

  constructor(
    public to: string,
    public subject: string,
    public text: string,
    public html: string,
    public attachmentContent?: string,
    public attachmentFilename?: string
  ) {}
}

function encodeUnicodeToBase64(str: string) {
  return btoa(
    encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, p1) => {
      return String.fromCharCode(Number('0x' + p1));
    })
  );
}

export class PkMailerManager extends EmailUtils implements EmailManager {
  constructor(private http: HttpClient) {
    super();
    this.http.setHeaders({ 'Content-Type': 'application/json' });
  }

  public async sendLoginCode(email: string, loginCode: string, magicLinkToken: string): Promise<any> {
    const subject = `${loginCode} - Log in to PK-Central`;
    const { html, text } = this.getLoginCodeTemplates(loginCode, magicLinkToken);
    const data = new EmailData(email, subject, text, html);
    return await this.sendMail(data);
  }

  public async sendSignupNotification(email: string): Promise<any> {
    const subject = 'A user signed up to PK-Central';
    const { html, text } = this.getSignupNotificationTemplates(email);
    const data = new EmailData(email, subject, text, html);
    return await this.sendMail(data);
  }

  public async sendDataBackup(name: string, email: string, backup: DataBackup): Promise<any> {
    const now = new Date();
    const date = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
    const subject = `Data backup for PK Central`;
    const { html, text } = this.getDataBackupTemplates(name);
    const filename = `pk-central-backup-${date}.json`;
    const content = encodeUnicodeToBase64(JSON.stringify(backup));
    const data = new EmailData(email, subject, text, html, content, filename);
    return await this.sendMail(data);
  }

  private async sendMail(data: EmailData): Promise<any> {
    try {
      console.log(`Sending email to ${data.to} via ${process.env.MAILER_URL}`);
      const res = await this.http.post(process.env.MAILER_URL!, data);
      return { message: 'Attempted to send email', response: JSON.stringify(res) };
    } catch (error: any) {
      console.error('Error in sendMail:');
      console.error(error);
      throw new Error(`Unable to send email: ${JSON.stringify(error)}`);
    }
  }
}
