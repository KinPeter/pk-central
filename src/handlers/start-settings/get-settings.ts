import { MongoDbManager } from '../../utils/mongo-db-manager.js';
import { AuthManager } from '../../utils/auth-manager.js';
import {
  UnauthorizedInvalidAccessTokenErrorResponse,
  OkResponse,
  NotFoundErrorResponse,
  UnknownErrorResponse,
} from '../../utils/response.js';
import { omitIdsForOne } from '../../utils/omit-ids.js';
import { PkStartSettings } from 'pk-common';

export async function getSettings(
  req: Request,
  dbManager: MongoDbManager,
  authManager: AuthManager
): Promise<Response> {
  try {
    const { db } = await dbManager.getMongoDb();
    const user = await authManager.authenticateUser(req, db);
    if (!user) return new UnauthorizedInvalidAccessTokenErrorResponse();

    const collection = db.collection<PkStartSettings>('start-settings');
    const settings = await collection.findOne({ userId: user.id });
    if (!settings) return new NotFoundErrorResponse('Start settings for user');

    return new OkResponse(omitIdsForOne(settings));
  } catch (e) {
    return new UnknownErrorResponse(e);
  } finally {
    await dbManager.closeMongoClient();
  }
}
