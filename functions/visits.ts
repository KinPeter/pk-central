import type { Config, Context } from '@netlify/functions';
import { CorsOkResponse, MethodNotAllowedResponse } from '../src/utils/response';
import { MongoDbManager } from '../src/utils/mongo-db-manager';
import { AuthManager } from '../src/utils/auth-manager';
import { getVisits } from '../src/handlers/visits/get-visits';
import { createVisit } from '../src/handlers/visits/create-visit';
import { updateVisit } from '../src/handlers/visits/update-visit';
import { deleteVisit } from '../src/handlers/visits/delete-visit';

export const config: Config = {
  path: ['/visits', '/visits/:id'],
  method: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
};

export default async (req: Request, context: Context) => {
  if (req.method === 'OPTIONS') return new CorsOkResponse();

  const { id } = context.params;
  const dbManager = new MongoDbManager();
  const authManager = new AuthManager();

  switch (req.method) {
    case 'GET':
      return await getVisits(req, dbManager, authManager);
    case 'POST':
      return await createVisit(req, dbManager, authManager);
    case 'PUT':
      return await updateVisit(req, id, dbManager, authManager);
    case 'DELETE':
      return await deleteVisit(req, id, dbManager, authManager);
    default:
      return new MethodNotAllowedResponse(req.method);
  }
};
