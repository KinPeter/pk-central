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
import { ApiError, Activities } from '../../../common';
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

    const collection = db.collection<Activities>(DbCollection.ACTIVITIES);
    const existingData = await collection.findOne({ userId: user.id });
    if (existingData) return new ErrorResponse(ApiError.DATA_ALREADY_EXISTS, 400);

    const data: Activities = {
      id: uuid(),
      userId: user.id,
      createdAt: new Date(),
      chores: [],
      walkWeeklyGoal: 0,
      walkMonthlyGoal: 0,
      cyclingWeeklyGoal: 0,
      cyclingMonthlyGoal: 0,
    };

    await collection.insertOne(data);

    return new OkResponse(omitIdsForOne(data), 201);
  } catch (e) {
    return new UnknownErrorResponse(e);
  } finally {
    await dbManager.closeMongoClient();
  }
}
