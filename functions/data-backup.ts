import { Config, Context } from '@netlify/functions';
import { CorsOkResponse, UnknownOperationErrorResponse } from '../src/utils/response';
import { MongoDbManager } from '../src/utils/mongo-db-manager';
import { AuthManager } from '../src/utils/auth-manager';
import { sendDataBackup } from '../src/handlers/data-backup/send-data-backup';
import { HttpClient } from '../src/utils/http-client';
import { PkMailerManager } from '../src/utils/pk-mailer-manager';

export const config: Config = {
  path: ['/data-backup/:operation'],
  method: ['GET', 'OPTIONS'],
};

export default async (req: Request, context: Context) => {
  if (req.method === 'OPTIONS') return new CorsOkResponse();

  const { operation } = context.params;
  const dbManager = new MongoDbManager();
  const authManager = new AuthManager();
  const httpClient = new HttpClient(fetch);

  switch (operation) {
    case 'email':
      return await sendDataBackup(req, dbManager, authManager, new PkMailerManager(httpClient));
    case 'data':
      return await sendDataBackup(req, dbManager, authManager);
    default:
      return new UnknownOperationErrorResponse(`/data-backup/${operation}`);
  }
};
