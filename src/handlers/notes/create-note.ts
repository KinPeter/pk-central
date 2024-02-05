import { MongoDbManager } from '../../utils/mongo-db-manager';
import { AuthManager } from '../../utils/auth-manager';
import { noteSchema } from 'pk-common';
import { createItemHandler } from '../_base-crud-handlers/create-handler';

export async function createNote(req: Request, dbManager: MongoDbManager, authManager: AuthManager): Promise<Response> {
  return await createItemHandler(req, dbManager, authManager, 'notes', noteSchema);
}
