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
import { Activities, SetGoalsRequest, goalsSchema } from 'pk-common';
import { DbCollection } from '../../utils/collections';

export async function updateGoals(
  req: Request,
  dbManager: MongoDbManager,
  authManager: AuthManager
): Promise<Response> {
  try {
    if (req.method !== 'PATCH') return new MethodNotAllowedResponse(req.method);

    const { db } = await dbManager.getMongoDb();
    const user = await authManager.authenticateUser(req, db);
    if (!user) return new UnauthorizedInvalidAccessTokenErrorResponse();

    const requestBody: SetGoalsRequest = await req.json();

    try {
      await goalsSchema.validate(requestBody);
    } catch (e: any) {
      return new ValidationErrorResponse(e);
    }

    const collection = db.collection<Activities>(DbCollection.ACTIVITIES);
    const data = await collection.findOneAndUpdate(
      { userId: user.id },
      {
        $set: {
          walkWeeklyGoal: requestBody.walkWeeklyGoal,
          walkMonthlyGoal: requestBody.walkMonthlyGoal,
          cyclingWeeklyGoal: requestBody.cyclingWeeklyGoal,
          cyclingMonthlyGoal: requestBody.cyclingMonthlyGoal,
        },
      },
      { returnDocument: 'after' }
    );
    if (!data) return new NotFoundErrorResponse('Activities data for user');

    return new OkResponse(omitIdsForOne(data));
  } catch (e) {
    return new UnknownErrorResponse(e);
  } finally {
    await dbManager.closeMongoClient();
  }
}
