import { MongoDbManager } from '../../utils/mongo-db-manager';
import { AuthManager } from '../../utils/auth-manager';
import {
  MethodNotAllowedResponse,
  NotFoundErrorResponse,
  OkResponse,
  UnauthorizedInvalidAccessTokenErrorResponse,
  UnknownErrorResponse,
  ValidationErrorResponse,
} from '../../utils/response';
import { omitIdsForOne } from '../../utils/omit-ids';
import { Cycling, type SetWeeklyGoalRequest, weeklyGoalSchema } from '../../../common';
import { DbCollection } from '../../utils/collections';

export async function updateWeeklyGoal(
  req: Request,
  dbManager: MongoDbManager,
  authManager: AuthManager
): Promise<Response> {
  try {
    if (req.method !== 'PATCH') return new MethodNotAllowedResponse(req.method);

    const { db } = await dbManager.getMongoDb();
    const user = await authManager.authenticateUser(req, db);
    if (!user) return new UnauthorizedInvalidAccessTokenErrorResponse();

    const requestBody = (await req.json()) as SetWeeklyGoalRequest;

    try {
      await weeklyGoalSchema.validate(requestBody);
    } catch (e: any) {
      return new ValidationErrorResponse(e);
    }

    const collection = db.collection<Cycling>(DbCollection.CYCLING);
    const cyclingData = await collection.findOneAndUpdate(
      { userId: user.id },
      { $set: { weeklyGoal: requestBody.weeklyGoal } },
      { returnDocument: 'after' }
    );
    if (!cyclingData) return new NotFoundErrorResponse('Cycling data for user');

    return new OkResponse(omitIdsForOne(cyclingData));
  } catch (e) {
    return new UnknownErrorResponse(e);
  } finally {
    await dbManager.closeMongoClient();
  }
}
