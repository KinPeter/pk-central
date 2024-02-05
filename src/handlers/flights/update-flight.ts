import { MongoDbManager } from '../../utils/mongo-db-manager';
import { AuthManager } from '../../utils/auth-manager';
import { flightSchema, UUID } from 'pk-common';
import { updateItemHandler } from '../_base-crud-handlers/update-handler';

export async function updateFlight(
  req: Request,
  id: UUID,
  dbManager: MongoDbManager,
  authManager: AuthManager
): Promise<Response> {
  return await updateItemHandler(req, id, dbManager, authManager, 'flights', flightSchema, 'Flight');
}
