import { MongoDbManager } from '../../utils/mongo-db-manager';
import { AuthManager } from '../../utils/auth-manager';
import { visitSchema } from 'pk-common';
import { createItemHandler } from '../_base-crud-handlers/create-handler';
import { toVisitRequest } from '../../utils/request-mappers';

export async function createVisit(
  req: Request,
  dbManager: MongoDbManager,
  authManager: AuthManager
): Promise<Response> {
  return await createItemHandler(req, dbManager, authManager, 'visits', visitSchema, toVisitRequest);
}
