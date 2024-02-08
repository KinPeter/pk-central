import { MongoDbManager } from '../../utils/mongo-db-manager';
import { AuthManager } from '../../utils/auth-manager';
import { shortcutSchema, UUID } from 'pk-common';
import { updateItemHandler } from '../_base-crud-handlers/update-handler';
import { toShortcutRequest } from '../../utils/request-mappers';

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
    'shortcuts',
    shortcutSchema,
    toShortcutRequest,
    'Shortcut'
  );
}
