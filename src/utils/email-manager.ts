import { DataBackup } from '../../common';

export interface EmailManager {
  sendLoginCode(email: string, loginCode: string): Promise<any>;
  sendSignupNotification(email: string): Promise<any>;
  sendDataBackup(name: string, email: string, backup: DataBackup): Promise<any>;
}
