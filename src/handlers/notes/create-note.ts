import { MongoDbManager } from '../../utils/mongo-db-manager';
import { AuthManager } from '../../utils/auth-manager';
import { noteSchema } from '../../../common';
import { createItemHandler } from '../_base-crud-handlers/create-handler';
import { toNoteRequest } from '../../utils/request-mappers';
import { DbCollection } from '../../utils/collections';

export async function createNote(req: Request, dbManager: MongoDbManager, authManager: AuthManager): Promise<Response> {
  return await createItemHandler(req, dbManager, authManager, DbCollection.NOTES, noteSchema, toNoteRequest);
}
