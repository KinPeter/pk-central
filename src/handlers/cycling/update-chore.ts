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
import { choreSchema, Cycling, type CyclingChoreRequest, type UUID } from '../../../common';
import { DbCollection } from '../../utils/collections';

export async function updateChore(
  req: Request,
  choreId: UUID,
  dbManager: MongoDbManager,
  authManager: AuthManager
): Promise<Response> {
  try {
    if (req.method !== 'PUT') return new MethodNotAllowedResponse(req.method);

    const { db } = await dbManager.getMongoDb();
    const user = await authManager.authenticateUser(req, db);
    if (!user) return new UnauthorizedInvalidAccessTokenErrorResponse();

    const requestBody: CyclingChoreRequest = await req.json();

    try {
      await choreSchema.validate(requestBody);
    } catch (e: any) {
      return new ValidationErrorResponse(e);
    }

    const collection = db.collection<Cycling>(DbCollection.CYCLING);
    const existingCyclingData = await collection.findOne({ userId: user.id });
    if (!existingCyclingData) return new NotFoundErrorResponse('Cycling data for user');
    if (!existingCyclingData.chores?.length) return new NotFoundErrorResponse('Chores for user');

    const indexToUpdate = existingCyclingData.chores?.findIndex(({ id }) => id === choreId);
    if (indexToUpdate === undefined || indexToUpdate < 0) return new NotFoundErrorResponse('Chore');

    const existingChores = existingCyclingData.chores;
    const choreToUpdate = existingChores[indexToUpdate];
    const newChores = [...existingChores];
    newChores.splice(indexToUpdate, 1, { ...choreToUpdate, ...requestBody });

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
