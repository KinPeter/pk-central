import { MongoDbManager } from '../../utils/mongo-db-manager';
import { AuthManager } from '../../utils/auth-manager';
import { getItemsHandler } from '../_base-crud-handlers/get-handler';

export async function getFlights(req: Request, dbManager: MongoDbManager, authManager: AuthManager): Promise<Response> {
  return await getItemsHandler(req, dbManager, authManager, 'flights');
}
