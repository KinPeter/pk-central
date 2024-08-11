import { Config, Context } from '@netlify/functions';
import { CorsOkResponse, UnknownOperationErrorResponse } from '../src/utils/response';
import { MongoDbManager } from '../src/utils/mongo-db-manager';
import { AuthManager } from '../src/utils/auth-manager';
import { sendDataBackup } from '../src/handlers/data-backup/send-data-backup';
import { NodeMailerManager } from '../src/utils/node-mailer-manager';
import { createTransport } from 'nodemailer';

export const config: Config = {
  path: ['/data-backup/:operation'],
  method: ['GET', 'OPTIONS'],
};

export default async (req: Request, context: Context) => {
  if (req.method === 'OPTIONS') return new CorsOkResponse();

  const { operation } = context.params;
  const dbManager = new MongoDbManager();
  const authManager = new AuthManager();

  switch (operation) {
    case 'email':
      return await sendDataBackup(req, dbManager, authManager, new NodeMailerManager(createTransport));
    case 'data':
      return await sendDataBackup(req, dbManager, authManager);
    default:
      return new UnknownOperationErrorResponse(`/data-backup/${operation}`);
  }
};
