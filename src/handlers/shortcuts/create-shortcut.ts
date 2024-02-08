import { MongoDbManager } from '../../utils/mongo-db-manager';
import { AuthManager } from '../../utils/auth-manager';
import { shortcutSchema } from 'pk-common';
import { createItemHandler } from '../_base-crud-handlers/create-handler';
import { toShortcutRequest } from '../../utils/request-mappers';

export async function createShortcut(
  req: Request,
  dbManager: MongoDbManager,
  authManager: AuthManager
): Promise<Response> {
  return await createItemHandler(req, dbManager, authManager, 'shortcuts', shortcutSchema, toShortcutRequest);
}
