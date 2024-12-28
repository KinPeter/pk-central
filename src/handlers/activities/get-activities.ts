import { MongoDbManager } from '../../utils/mongo-db-manager';
import { AuthManager } from '../../utils/auth-manager';
import {
  UnauthorizedInvalidAccessTokenErrorResponse,
  OkResponse,
  NotFoundErrorResponse,
  UnknownErrorResponse,
  MethodNotAllowedResponse,
} from '../../utils/response';
import { omitIdsForOne } from '../../utils/omit-ids';
import { Activities } from 'pk-common';

export async function getActivities(
  req: Request,
  dbManager: MongoDbManager,
  authManager: AuthManager
): Promise<Response> {
  try {
    if (req.method !== 'GET') return new MethodNotAllowedResponse(req.method);

    const { db } = await dbManager.getMongoDb();
    const user = await authManager.authenticateUser(req, db);
    if (!user) return new UnauthorizedInvalidAccessTokenErrorResponse();

    const collection = db.collection<Activities>('activities');
    const data = await collection.findOne({ userId: user.id });
    if (!data) return new NotFoundErrorResponse('Activities for user');

    return new OkResponse(omitIdsForOne(data));
  } catch (e) {
    return new UnknownErrorResponse(e);
  } finally {
    await dbManager.closeMongoClient();
  }
}
