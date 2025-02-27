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
import { Cycling, type SetMonthlyGoalRequest, monthlyGoalSchema } from '../../../common';
import { DbCollection } from '../../utils/collections';

export async function updateMonthlyGoal(
  req: Request,
  dbManager: MongoDbManager,
  authManager: AuthManager
): Promise<Response> {
  try {
    if (req.method !== 'PATCH') return new MethodNotAllowedResponse(req.method);

    const { db } = await dbManager.getMongoDb();
    const user = await authManager.authenticateUser(req, db);
    if (!user) return new UnauthorizedInvalidAccessTokenErrorResponse();

    const requestBody = (await req.json()) as SetMonthlyGoalRequest;

    try {
      await monthlyGoalSchema.validate(requestBody);
    } catch (e: any) {
      return new ValidationErrorResponse(e);
    }

    const collection = db.collection<Cycling>(DbCollection.CYCLING);
    const cyclingData = await collection.findOneAndUpdate(
      { userId: user.id },
      { $set: { monthlyGoal: requestBody.monthlyGoal } },
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
