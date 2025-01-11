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
import { Cycling, type CyclingChoreRequest, choreSchema } from '../../../common';
import { v4 as uuid } from 'uuid';
import { toCyclingChoreRequest } from '../../utils/request-mappers';
import { DbCollection } from '../../utils/collections';

export async function addChore(req: Request, dbManager: MongoDbManager, authManager: AuthManager): Promise<Response> {
  try {
    if (req.method !== 'POST') return new MethodNotAllowedResponse(req.method);

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
    const existingData = await collection.findOne({ userId: user.id });
    if (!existingData) return new NotFoundErrorResponse('Cycling data for user');

    const cyclingData = await collection.findOneAndUpdate(
      { userId: user.id },
      {
        $set: {
          chores: [
            ...(existingData.chores ?? []),
            {
              id: uuid(),
              ...toCyclingChoreRequest(requestBody),
            },
          ],
        },
      },
      { returnDocument: 'after' }
    );
    if (!cyclingData) return new NotFoundErrorResponse('Cycling data for user');

    return new OkResponse(omitIdsForOne(cyclingData), 201);
  } catch (e) {
    return new UnknownErrorResponse(e);
  } finally {
    await dbManager.closeMongoClient();
  }
}
