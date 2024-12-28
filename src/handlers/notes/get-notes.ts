import { MongoDbManager } from '../../utils/mongo-db-manager';
import { AuthManager } from '../../utils/auth-manager';
import { getItemsHandler } from '../_base-crud-handlers/get-handler';
import { DbCollection } from '../../utils/collections';

export async function getNotes(req: Request, dbManager: MongoDbManager, authManager: AuthManager): Promise<Response> {
  return await getItemsHandler(req, dbManager, authManager, DbCollection.NOTES);
}
