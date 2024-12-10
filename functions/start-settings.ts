import { Config, Context } from '@netlify/functions';
import { CorsOkResponse, MethodNotAllowedResponse } from '../src/utils/response';
import { MongoDbManager } from '../src/utils/mongo-db-manager';
import { AuthManager } from '../src/utils/auth-manager';
import { getSettings } from '../src/handlers/start-settings/get-settings';
import { updateSettings } from '../src/handlers/start-settings/update-settings';

export const config: Config = {
  path: ['/start-settings'],
  method: ['GET', 'PUT', 'OPTIONS'],
};

export default async (req: Request, _context: Context) => {
  if (req.method === 'OPTIONS') return new CorsOkResponse();

  const dbManager = new MongoDbManager();
  const authManager = new AuthManager();

  switch (req.method) {
    case 'GET':
      return await getSettings(req, dbManager, authManager);
    case 'PUT':
      return await updateSettings(req, dbManager, authManager);
    default:
      return new MethodNotAllowedResponse(req.method);
  }
};
