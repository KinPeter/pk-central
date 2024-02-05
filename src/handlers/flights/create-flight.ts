import { MongoDbManager } from '../../utils/mongo-db-manager';
import { AuthManager } from '../../utils/auth-manager';
import { flightSchema } from 'pk-common';
import { createItemHandler } from '../_base-crud-handlers/create-handler';

export async function createFlight(
  req: Request,
  dbManager: MongoDbManager,
  authManager: AuthManager
): Promise<Response> {
  return await createItemHandler(req, dbManager, authManager, 'flights', flightSchema);
}
