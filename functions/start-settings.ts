import { Config, Context } from '@netlify/functions';
import { CorsOkResponse, ErrorResponse, MethodNotAllowedResponse } from '../src/utils/response.js';
import { MongoDbManager } from '../src/utils/mongo-db-manager.js';
import { AuthManager } from '../src/utils/auth-manager.js';
import { getAllFlights } from '../src/handlers/flights/get-all-flights.js';
import { getSettings } from '../src/handlers/start-settings/get-settings.js';

export const config: Config = {
  path: ['/start-settings'],
  method: ['GET', 'POST', 'PUT', 'OPTIONS'],
};

export default async (req: Request, context: Context) => {
  if (req.method === 'OPTIONS') return new CorsOkResponse();

  const dbManager = new MongoDbManager();
  const authManager = new AuthManager();

  switch (req.method) {
    case 'GET':
      return await getSettings(req, dbManager, authManager);
    default:
      return new MethodNotAllowedResponse(req.method);
  }
};
