import { MongoDbManager } from '../../utils/mongo-db-manager';
import { AuthManager } from '../../utils/auth-manager';
import {
  MethodNotAllowedResponse,
  NotFoundErrorResponse,
  OkResponse,
  UnauthorizedInvalidAccessTokenErrorResponse,
  UnknownErrorResponse,
} from '../../utils/response';
import { omitIdsForOne } from '../../utils/omit-ids';
import { Activities, type UUID } from '../../../common';
import { DbCollection } from '../../utils/collections';

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

    const collection = db.collection<Activities>(DbCollection.ACTIVITIES);
    const existingData = await collection.findOne({ userId: user.id });
    if (!existingData) return new NotFoundErrorResponse('Activities data for user');
    if (!existingData.chores?.length) return new NotFoundErrorResponse('Chores for user');

    const indexToDelete = existingData.chores?.findIndex(({ id }) => id === choreId);
    if (indexToDelete === undefined || indexToDelete < 0) return new NotFoundErrorResponse('Chore');

    const existingChores = existingData.chores;
    const newChores = [...existingChores];
    newChores.splice(indexToDelete, 1);

    const data = await collection.findOneAndUpdate(
      { userId: user.id },
      {
        $set: {
          chores: newChores,
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
