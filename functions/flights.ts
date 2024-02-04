import { Config, Context } from '@netlify/functions';
import { CorsOkResponse, ErrorResponse } from '../src/utils/response';
import { MongoDbManager } from '../src/utils/mongo-db-manager';
import { AuthManager } from '../src/utils/auth-manager';
import { getAllFlights } from '../src/handlers/flights/get-all-flights';

export const config: Config = {
  path: ['/flights', '/flights/:operation'],
  method: ['GET', 'POST', 'PUT', 'OPTIONS'],
};

export default async (req: Request, context: Context) => {
  if (req.method === 'OPTIONS') return new CorsOkResponse();

  const { operation } = context.params;
  const dbManager = new MongoDbManager();
  const authManager = new AuthManager();

  switch (operation) {
    case 'all':
      return await getAllFlights(req, dbManager, authManager);
    default:
      return new ErrorResponse(`Unknown operation: /flights/${operation}`, 400);
  }
};
