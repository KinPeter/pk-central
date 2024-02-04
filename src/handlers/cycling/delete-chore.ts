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
import { choreSchema, Cycling, CyclingChoreRequest, UUID } from 'pk-common';

export async function deleteChore(
  req: Request,
  choreId: UUID,
  dbManager: MongoDbManager,
  authManager: AuthManager
): Promise<Response> {
  try {
    if (req.method !== 'DELETE') return new MethodNotAllowedResponse(req.method);

    const { db } = await dbManager.getMongoDb();
    const user = await authManager.authenticateUser(req, db);
    if (!user) return new UnauthorizedInvalidAccessTokenErrorResponse();

    const collection = db.collection<Cycling>('cycling');
    const existingCyclingData = await collection.findOne({ userId: user.id });
    if (!existingCyclingData) return new NotFoundErrorResponse('Cycling data for user');
    if (!existingCyclingData.chores?.length) return new NotFoundErrorResponse('Chores for user');

    const indexToDelete = existingCyclingData.chores?.findIndex(({ id }) => id === choreId);
    if (indexToDelete === undefined || indexToDelete < 0) return new NotFoundErrorResponse('Chore');

    const existingChores = existingCyclingData.chores;
    const newChores = [...existingChores];
    newChores.splice(indexToDelete, 1);

    const cyclingData = await collection.findOneAndUpdate(
      { userId: user.id },
      {
        $set: {
          chores: newChores,
        },
      },
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
