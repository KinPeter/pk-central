import { MongoDbManager } from '../../utils/mongo-db-manager';
import { AuthManager } from '../../utils/auth-manager';
import { shortcutSchema, type UUID } from '../../../common';
import { updateItemHandler } from '../_base-crud-handlers/update-handler';
import { toShortcutRequest } from '../../utils/request-mappers';
import { DbCollection } from '../../utils/collections';

export async function updateShortcut(
  req: Request,
  id: UUID,
  dbManager: MongoDbManager,
  authManager: AuthManager
): Promise<Response> {
  return await updateItemHandler(
    req,
    id,
    dbManager,
    authManager,
    DbCollection.SHORTCUTS,
    shortcutSchema,
    toShortcutRequest,
    'Shortcut'
  );
}
