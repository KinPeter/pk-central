import { MongoDbManager } from '../../utils/mongo-db-manager';
import { AuthManager } from '../../utils/auth-manager';
import {
  OkResponse,
  UnauthorizedInvalidAccessTokenErrorResponse,
  UnknownErrorResponse,
  ValidationErrorResponse,
} from '../../utils/response';
import { v4 as uuid } from 'uuid';
import { omitIdsForOne } from '../../utils/omit-ids';
import { ObjectSchema } from 'yup';
import type { DbCollection } from '../../utils/collections';

export async function createItemHandler(
  req: Request,
  dbManager: MongoDbManager,
  authManager: AuthManager,
  collectionName: DbCollection,
  requestSchema: ObjectSchema<any>,
  requestMapper: (body: any) => any
): Promise<Response> {
  try {
    const { db } = await dbManager.getMongoDb();
    const user = await authManager.authenticateUser(req, db);
    if (!user) return new UnauthorizedInvalidAccessTokenErrorResponse();

    const requestBody = await req.json();

    try {
      await requestSchema.validate(requestBody);
    } catch (e: any) {
      console.log(e);
      return new ValidationErrorResponse(e);
    }

    const collection = db.collection(collectionName);

    const newItem = {
      id: uuid(),
      userId: user.id,
      createdAt: new Date(),
      ...requestMapper(requestBody),
    };

    await collection.insertOne(newItem);

    return new OkResponse(omitIdsForOne(newItem), 201);
  } catch (e) {
    return new UnknownErrorResponse(e);
  } finally {
    await dbManager.closeMongoClient();
  }
}
