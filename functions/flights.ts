import { Config, Context } from '@netlify/functions';
import { CorsOkResponse, MethodNotAllowedResponse } from '../src/utils/response';
import { MongoDbManager } from '../src/utils/mongo-db-manager';
import { AuthManager } from '../src/utils/auth-manager';
import { getFlights } from '../src/handlers/flights/get-flights';
import { createFlight } from '../src/handlers/flights/create-flight';
import { updateFlight } from '../src/handlers/flights/update-flight';
import { deleteFlight } from '../src/handlers/flights/delete-flight';

export const config: Config = {
  path: ['/flights', '/flights/:id'],
  method: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
};

export default async (req: Request, context: Context) => {
  if (req.method === 'OPTIONS') return new CorsOkResponse();

  const { id } = context.params;
  const dbManager = new MongoDbManager();
  const authManager = new AuthManager();

  switch (req.method) {
    case 'GET':
      return await getFlights(req, dbManager, authManager);
    case 'POST':
      return await createFlight(req, dbManager, authManager);
    case 'PUT':
      return await updateFlight(req, id, dbManager, authManager);
    case 'DELETE':
      return await deleteFlight(req, id, dbManager, authManager);
    default:
      return new MethodNotAllowedResponse(req.method);
  }
};
