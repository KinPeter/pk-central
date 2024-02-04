import { Config, Context } from '@netlify/functions';
import { CorsOkResponse } from '../src/utils/response';
import { MongoDbManager } from '../src/utils/mongo-db-manager';
import { AuthManager } from '../src/utils/auth-manager';
import { EmailManager } from '../src/utils/email-manager';
import { createTransport } from 'nodemailer';
import { sendDataBackup } from '../src/handlers/data-backup/send-data-backup';

export const config: Config = {
  path: ['/data-backup'],
  method: ['GET', 'OPTIONS'],
};

export default async (req: Request, context: Context) => {
  if (req.method === 'OPTIONS') return new CorsOkResponse();

  const dbManager = new MongoDbManager();
  const authManager = new AuthManager();

  return await sendDataBackup(req, dbManager, authManager, new EmailManager(createTransport));
};
