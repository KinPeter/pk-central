import { MongoDbManager } from '../../utils/mongo-db-manager';
import { AuthManager } from '../../utils/auth-manager';
import { OkResponse, UnauthorizedInvalidAccessTokenErrorResponse, UnknownErrorResponse } from '../../utils/response';
import { omitIds } from '../../utils/omit-ids';
import type { DbCollection } from '../../utils/collections';

export async function getItemsHandler(
  req: Request,
  dbManager: MongoDbManager,
  authManager: AuthManager,
  collectionName: DbCollection
): Promise<Response> {
  try {
    const { db } = await dbManager.getMongoDb();
    const user = await authManager.authenticateUser(req, db);
    if (!user) return new UnauthorizedInvalidAccessTokenErrorResponse();

    const collection = db.collection(collectionName);
    const cursor = collection.find({ userId: user.id });
    const results = await cursor.toArray();

    return new OkResponse(omitIds(results));
  } catch (e) {
    return new UnknownErrorResponse(e);
  } finally {
    await dbManager.closeMongoClient();
  }
}
