import { getEnv } from './environment';

interface EmailTemplates {
  html: string;
  text: string;
}

export class EmailUtils {
  protected getLoginCodeTemplates(loginCode: string): EmailTemplates {
    const [loginCodeExpiry] = getEnv('LOGIN_CODE_EXPIRY');
    const expiresInMinutes = Number(loginCodeExpiry);
    const html = `
    <h3>Hello!</h3>
    <p>Please use the code below to log in, it expires in ${expiresInMinutes} minutes.</p>
    <h1>${loginCode}</h1>
    `;
    const text = `
    Hello!
    Your code to log in: ${loginCode}.
    You can use it within the next ${expiresInMinutes} minutes.
    `;
    return { html, text };
  }

  protected getSignupNotificationTemplates(email: string) {
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

  protected getDataBackupTemplates(name: string) {
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
