import { MongoDbManager } from '../../utils/mongo-db-manager';
import { AuthManager } from '../../utils/auth-manager';
import {
  ErrorResponse,
  NotFoundErrorResponse,
  OkResponse,
  UnauthorizedInvalidAccessTokenErrorResponse,
  UnknownErrorResponse,
  ValidationErrorResponse,
} from '../../utils/response';
import { UUID, ValidationError } from 'pk-common';
import { omitIdsForOne } from '../../utils/omit-ids';
import * as yup from 'yup';
import { ObjectSchema } from 'yup';
import { DbCollection } from '../../utils/collections';

export async function updateItemHandler(
  req: Request,
  id: UUID,
  dbManager: MongoDbManager,
  authManager: AuthManager,
  collectionName: DbCollection,
  requestSchema: ObjectSchema<any>,
  requestMapper: (body: any) => any,
  itemName: string
): Promise<Response> {
  try {
    if (!id || !yup.string().uuid().isValidSync(id)) return new ErrorResponse(ValidationError.INVALID_UUID, 400);

    const { db } = await dbManager.getMongoDb();
    const user = await authManager.authenticateUser(req, db);
    if (!user) return new UnauthorizedInvalidAccessTokenErrorResponse();

    const requestBody = await req.json();

    try {
      await requestSchema.validate(requestBody);
    } catch (e: any) {
      return new ValidationErrorResponse(e);
    }

    const collection = db.collection(collectionName);

    const result = await collection.findOneAndUpdate(
      { id, userId: user.id },
      { $set: { ...requestMapper(requestBody) } },
      { returnDocument: 'after' }
    );
    if (!result) return new NotFoundErrorResponse(itemName);

    return new OkResponse(omitIdsForOne(result));
  } catch (e) {
    return new UnknownErrorResponse(e);
  } finally {
    await dbManager.closeMongoClient();
  }
}
