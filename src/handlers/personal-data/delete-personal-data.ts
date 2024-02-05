import { MongoDbManager } from '../../utils/mongo-db-manager';
import { AuthManager } from '../../utils/auth-manager';
import { UUID } from 'pk-common';
import { deleteItemHandler } from '../_base-crud-handlers/delete-handler';

export async function deletePersonalData(
  req: Request,
  id: UUID,
  dbManager: MongoDbManager,
  authManager: AuthManager
): Promise<Response> {
  return await deleteItemHandler(req, id, dbManager, authManager, 'personal-data', 'Personal data');
}
