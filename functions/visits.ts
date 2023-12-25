import { Config, Context } from '@netlify/functions';
import { CorsOkResponse, ErrorResponse } from '../src/utils/response.js';
import { getAllVisits } from '../src/handlers/visits.handler.js';
import { MongoDbManager } from '../src/utils/mongo-db-manager.js';
import { AuthManager } from '../src/utils/auth-manager.js';

export const config: Config = {
  path: ['/visits', '/visits/:operation'],
  method: ['GET', 'POST', 'PUT', 'OPTIONS'],
};

export default async (req: Request, context: Context) => {
  if (req.method === 'OPTIONS') return new CorsOkResponse();

  const { operation } = context.params;
  const dbManager = new MongoDbManager();
  const authManager = new AuthManager();

  switch (operation) {
    case 'all':
      return await getAllVisits(req, context, dbManager, authManager);
    default:
      return new ErrorResponse(`Unknown operation: /visits/${operation}`, 400);
  }
};
