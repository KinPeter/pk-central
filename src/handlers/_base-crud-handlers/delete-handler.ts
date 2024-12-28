import { MongoDbManager } from '../../utils/mongo-db-manager';
import { AuthManager } from '../../utils/auth-manager';
import {
  ErrorResponse,
  NotFoundErrorResponse,
  OkResponse,
  UnauthorizedInvalidAccessTokenErrorResponse,
  UnknownErrorResponse,
} from '../../utils/response';
import { UUID, ValidationError } from 'pk-common';
import * as yup from 'yup';
import { DbCollection } from '../../utils/collections';

export async function deleteItemHandler(
  req: Request,
  id: UUID,
  dbManager: MongoDbManager,
  authManager: AuthManager,
  collectionName: DbCollection,
  itemName: string
): Promise<Response> {
  try {
    if (!id || !yup.string().uuid().isValidSync(id)) return new ErrorResponse(ValidationError.INVALID_UUID, 400);

    const { db } = await dbManager.getMongoDb();
    const user = await authManager.authenticateUser(req, db);
    if (!user) return new UnauthorizedInvalidAccessTokenErrorResponse();

    const collection = db.collection(collectionName);

    const result = await collection.findOneAndDelete({ id, userId: user.id });
    if (!result) return new NotFoundErrorResponse(itemName);

    return new OkResponse({ id });
  } catch (e) {
    return new UnknownErrorResponse(e);
  } finally {
    await dbManager.closeMongoClient();
  }
}
