import { MongoDbManager } from '../../utils/mongo-db-manager';
import { AuthManager } from '../../utils/auth-manager';
import { UUID, visitSchema } from 'pk-common';
import { updateItemHandler } from '../_base-crud-handlers/update-handler';
import { toVisitRequest } from '../../utils/request-mappers';

export async function updateVisit(
  req: Request,
  id: UUID,
  dbManager: MongoDbManager,
  authManager: AuthManager
): Promise<Response> {
  return await updateItemHandler(req, id, dbManager, authManager, 'visits', visitSchema, toVisitRequest, 'Visit');
}
