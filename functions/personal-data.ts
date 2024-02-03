import { Config, Context } from '@netlify/functions';
import { CorsOkResponse, MethodNotAllowedResponse } from '../src/utils/response.js';
import { MongoDbManager } from '../src/utils/mongo-db-manager.js';
import { AuthManager } from '../src/utils/auth-manager.js';
import { getPersonalData } from '../src/handlers/personal-data/get-personal-data.js';
import { createPersonalData } from '../src/handlers/personal-data/create-personal-data.js';
import { updatePersonalData } from '../src/handlers/personal-data/update-personal-data.js';
import { deletePersonalData } from '../src/handlers/personal-data/delete-personal-data.js';

export const config: Config = {
  path: ['/personal-data', '/personal-data/:id'],
  method: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
};

export default async (req: Request, context: Context) => {
  if (req.method === 'OPTIONS') return new CorsOkResponse();

  const { id } = context.params;
  const dbManager = new MongoDbManager();
  const authManager = new AuthManager();

  switch (req.method) {
    case 'GET':
      return await getPersonalData(req, dbManager, authManager);
    case 'POST':
      return await createPersonalData(req, dbManager, authManager);
    case 'PUT':
      return await updatePersonalData(req, id, dbManager, authManager);
    case 'DELETE':
      return await deletePersonalData(req, id, dbManager, authManager);
    default:
      return new MethodNotAllowedResponse(req.method);
  }
};
