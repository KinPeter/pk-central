import { DataBackup } from 'pk-common';

export interface EmailManager {
  sendLoginCode(email: string, loginCode: string, magicLinkToken: string): Promise<any>;
  sendSignupNotification(email: string): Promise<any>;
  sendDataBackup(name: string, email: string, backup: DataBackup): Promise<any>;
}
