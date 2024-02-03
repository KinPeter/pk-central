import { MongoDbManager } from '../../utils/mongo-db-manager.js';
import { AuthManager } from '../../utils/auth-manager.js';
import { OkResponse, UnauthorizedInvalidAccessTokenErrorResponse, UnknownErrorResponse } from '../../utils/response.js';
import { Note } from 'pk-common';
import { omitIds } from '../../utils/omit-ids.js';

export async function getNotes(req: Request, dbManager: MongoDbManager, authManager: AuthManager): Promise<Response> {
  try {
    const { db } = await dbManager.getMongoDb();
    const user = await authManager.authenticateUser(req, db);
    if (!user) return new UnauthorizedInvalidAccessTokenErrorResponse();

    const collection = db.collection<Note>('notes');
    const cursor = collection.find({ userId: user.id });
    const results = await cursor.toArray();

    return new OkResponse(omitIds(results));
  } catch (e) {
    return new UnknownErrorResponse(e);
  } finally {
    await dbManager.closeMongoClient();
  }
}
