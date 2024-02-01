import { Config, Context } from '@netlify/functions';
import { CorsOkResponse, MethodNotAllowedResponse } from '../src/utils/response.js';
import { MongoDbManager } from '../src/utils/mongo-db-manager.js';
import { AuthManager } from '../src/utils/auth-manager.js';
import { getSettings } from '../src/handlers/start-settings/get-settings.js';
import { updateSettings } from '../src/handlers/start-settings/update-settings.js';

export const config: Config = {
  path: ['/start-settings'],
  method: ['GET', 'PUT', 'OPTIONS'],
};

export default async (req: Request, context: Context) => {
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
