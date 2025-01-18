import { Config, Context } from '../server/types';
import { CorsOkResponse, MethodNotAllowedResponse } from '../src/utils/response';
import { MongoDbManager } from '../src/utils/mongo-db-manager';
import { AuthManager } from '../src/utils/auth-manager';
import { deleteShortcut } from '../src/handlers/shortcuts/delete-shortcut';
import { getShortcuts } from '../src/handlers/shortcuts/get-shortcuts';
import { createShortcut } from '../src/handlers/shortcuts/create-shortcut';
import { updateShortcut } from '../src/handlers/shortcuts/update-shortcut';

export const config: Config = {
  path: ['/shortcuts', '/shortcuts/:id'],
  method: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
};

export default async (req: Request, context: Context) => {
  if (req.method === 'OPTIONS') return new CorsOkResponse();

  const { id } = context.params;
  const dbManager = new MongoDbManager();
  const authManager = new AuthManager();

  switch (req.method) {
    case 'GET':
      return await getShortcuts(req, dbManager, authManager);
    case 'POST':
      return await createShortcut(req, dbManager, authManager);
    case 'PUT':
      return await updateShortcut(req, id, dbManager, authManager);
    case 'DELETE':
      return await deleteShortcut(req, id, dbManager, authManager);
    default:
      return new MethodNotAllowedResponse(req.method);
  }
};
