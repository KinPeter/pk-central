import { MongoDbManager } from '../../utils/mongo-db-manager';
import { AuthManager } from '../../utils/auth-manager';
import type { UUID } from '../../../common';
import { deleteItemHandler } from '../_base-crud-handlers/delete-handler';
import { DbCollection } from '../../utils/collections';

export async function deleteShortcut(
  req: Request,
  id: UUID,
  dbManager: MongoDbManager,
  authManager: AuthManager
): Promise<Response> {
  return await deleteItemHandler(req, id, dbManager, authManager, DbCollection.SHORTCUTS, 'Shortcut');
}
