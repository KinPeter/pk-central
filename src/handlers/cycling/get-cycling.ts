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
import { Cycling } from '../../../common';
import { DbCollection } from '../../utils/collections';

export async function getCycling(req: Request, dbManager: MongoDbManager, authManager: AuthManager): Promise<Response> {
  try {
    if (req.method !== 'GET') return new MethodNotAllowedResponse(req.method);

    const { db } = await dbManager.getMongoDb();
    const user = await authManager.authenticateUser(req, db);
    if (!user) return new UnauthorizedInvalidAccessTokenErrorResponse();

    const collection = db.collection<Cycling>(DbCollection.CYCLING);
    const cyclingData = await collection.findOne({ userId: user.id });
    if (!cyclingData) return new NotFoundErrorResponse('Cycling for user');

    return new OkResponse(omitIdsForOne(cyclingData));
  } catch (e) {
    return new UnknownErrorResponse(e);
  } finally {
    await dbManager.closeMongoClient();
  }
}
