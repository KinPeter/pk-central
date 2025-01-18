import { MongoDbManager } from '../../utils/mongo-db-manager';
import { AuthManager } from '../../utils/auth-manager';
import { shortcutSchema } from '../../../common';
import { createItemHandler } from '../_base-crud-handlers/create-handler';
import { toShortcutRequest } from '../../utils/request-mappers';
import { DbCollection } from '../../utils/collections';

export async function createShortcut(
  req: Request,
  dbManager: MongoDbManager,
  authManager: AuthManager
): Promise<Response> {
  return await createItemHandler(
    req,
    dbManager,
    authManager,
    DbCollection.SHORTCUTS,
    shortcutSchema,
    toShortcutRequest
  );
}
