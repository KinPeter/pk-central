import { Config, Context } from '../server/types';
import { CorsOkResponse, MethodNotAllowedResponse } from '../src/utils/response';
import { MongoDbManager } from '../src/utils/mongo-db-manager';
import { AuthManager } from '../src/utils/auth-manager';
import { getPersonalData } from '../src/handlers/personal-data/get-personal-data';
import { createPersonalData } from '../src/handlers/personal-data/create-personal-data';
import { updatePersonalData } from '../src/handlers/personal-data/update-personal-data';
import { deletePersonalData } from '../src/handlers/personal-data/delete-personal-data';

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
