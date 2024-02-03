import { Config, Context } from '@netlify/functions';
import { CorsOkResponse } from '../src/utils/response.js';
import { MongoDbManager } from '../src/utils/mongo-db-manager.js';
import { AuthManager } from '../src/utils/auth-manager.js';
import { EmailManager } from '../src/utils/email-manager.js';
import { createTransport } from 'nodemailer';
import { sendDataBackup } from '../src/handlers/data-backup/send-data-backup.js';

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
