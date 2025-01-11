import { MongoDbManager } from '../../utils/mongo-db-manager';
import { AuthManager } from '../../utils/auth-manager';
import { flightSchema } from '../../../common';
import { createItemHandler } from '../_base-crud-handlers/create-handler';
import { toFlightRequest } from '../../utils/request-mappers';
import { DbCollection } from '../../utils/collections';

export async function createFlight(
  req: Request,
  dbManager: MongoDbManager,
  authManager: AuthManager
): Promise<Response> {
  return await createItemHandler(req, dbManager, authManager, DbCollection.FLIGHTS, flightSchema, toFlightRequest);
}
