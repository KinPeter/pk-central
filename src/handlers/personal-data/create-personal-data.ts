import { MongoDbManager } from '../../utils/mongo-db-manager';
import { AuthManager } from '../../utils/auth-manager';
import { personalDataSchema } from 'pk-common';
import { createItemHandler } from '../_base-crud-handlers/create-handler';

export async function createPersonalData(
  req: Request,
  dbManager: MongoDbManager,
  authManager: AuthManager
): Promise<Response> {
  return await createItemHandler(req, dbManager, authManager, 'personal-data', personalDataSchema);
}
