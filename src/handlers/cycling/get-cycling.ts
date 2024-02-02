import { MongoDbManager } from '../../utils/mongo-db-manager.js';
import { AuthManager } from '../../utils/auth-manager.js';
import {
  UnauthorizedInvalidAccessTokenErrorResponse,
  OkResponse,
  NotFoundErrorResponse,
  UnknownErrorResponse,
  MethodNotAllowedResponse,
} from '../../utils/response.js';
import { omitIdsForOne } from '../../utils/omit-ids.js';
import { Cycling } from 'pk-common';

export async function getCycling(req: Request, dbManager: MongoDbManager, authManager: AuthManager): Promise<Response> {
  try {
    if (req.method !== 'GET') return new MethodNotAllowedResponse(req.method);

    const { db } = await dbManager.getMongoDb();
    const user = await authManager.authenticateUser(req, db);
    if (!user) return new UnauthorizedInvalidAccessTokenErrorResponse();

    const collection = db.collection<Cycling>('cycling');
    const cyclingData = await collection.findOne({ userId: user.id });
    if (!cyclingData) return new NotFoundErrorResponse('Cycling for user');

    return new OkResponse(omitIdsForOne(cyclingData));
  } catch (e) {
    return new UnknownErrorResponse(e);
  } finally {
    await dbManager.closeMongoClient();
  }
}
