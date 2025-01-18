import { MongoDbManager } from '../../utils/mongo-db-manager';
import { AuthManager } from '../../utils/auth-manager';
import {
  UnauthorizedInvalidAccessTokenErrorResponse,
  OkResponse,
  UnknownErrorResponse,
  MethodNotAllowedResponse,
  ErrorResponse,
} from '../../utils/response';
import { omitIdsForOne } from '../../utils/omit-ids';
import { ApiError, Cycling } from '../../../common';
import { v4 as uuid } from 'uuid';
import { DbCollection } from '../../utils/collections';

export async function createInitialData(
  req: Request,
  dbManager: MongoDbManager,
  authManager: AuthManager
): Promise<Response> {
  try {
    if (req.method !== 'POST') return new MethodNotAllowedResponse(req.method);

    const { db } = await dbManager.getMongoDb();
    const user = await authManager.authenticateUser(req, db);
    if (!user) return new UnauthorizedInvalidAccessTokenErrorResponse();

    const collection = db.collection<Cycling>(DbCollection.CYCLING);
    const existingData = await collection.findOne({ userId: user.id });
    if (existingData) return new ErrorResponse(ApiError.DATA_ALREADY_EXISTS, 400);

    const cyclingData: Cycling = {
      id: uuid(),
      userId: user.id,
      createdAt: new Date(),
      chores: [],
      weeklyGoal: 0,
      monthlyGoal: 0,
    };

    await collection.insertOne(cyclingData);

    return new OkResponse(omitIdsForOne(cyclingData), 201);
  } catch (e) {
    return new UnknownErrorResponse(e);
  } finally {
    await dbManager.closeMongoClient();
  }
}
