import { MongoDbManager } from '../../utils/mongo-db-manager';
import { AuthManager } from '../../utils/auth-manager';
import {
  UnauthorizedInvalidAccessTokenErrorResponse,
  OkResponse,
  NotFoundErrorResponse,
  UnknownErrorResponse,
} from '../../utils/response';
import { omitIdsForOne } from '../../utils/omit-ids';
import { PkStartSettings } from '../../../common';
import { DbCollection } from '../../utils/collections';

export async function getSettings(
  req: Request,
  dbManager: MongoDbManager,
  authManager: AuthManager
): Promise<Response> {
  try {
    const { db } = await dbManager.getMongoDb();
    const user = await authManager.authenticateUser(req, db);
    if (!user) return new UnauthorizedInvalidAccessTokenErrorResponse();

    const collection = db.collection<PkStartSettings>(DbCollection.START_SETTINGS);
    const settings = await collection.findOne({ userId: user.id });
    if (!settings) return new NotFoundErrorResponse('Start settings for user');

    return new OkResponse(omitIdsForOne(settings));
  } catch (e) {
    return new UnknownErrorResponse(e);
  } finally {
    await dbManager.closeMongoClient();
  }
}
