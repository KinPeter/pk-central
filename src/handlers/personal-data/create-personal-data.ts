import { MongoDbManager } from '../../utils/mongo-db-manager';
import { AuthManager } from '../../utils/auth-manager';
import {
  OkResponse,
  UnauthorizedInvalidAccessTokenErrorResponse,
  UnknownErrorResponse,
  ValidationErrorResponse,
} from '../../utils/response';
import { PersonalDataRequest, PersonalData, personalDataSchema } from 'pk-common';
import { v4 as uuid } from 'uuid';
import { omitIdsForOne } from '../../utils/omit-ids';

export async function createPersonalData(
  req: Request,
  dbManager: MongoDbManager,
  authManager: AuthManager
): Promise<Response> {
  try {
    const { db } = await dbManager.getMongoDb();
    const user = await authManager.authenticateUser(req, db);
    if (!user) return new UnauthorizedInvalidAccessTokenErrorResponse();

    const requestBody: PersonalDataRequest = await req.json();

    try {
      await personalDataSchema.validate(requestBody);
    } catch (e: any) {
      return new ValidationErrorResponse(e);
    }

    const collection = db.collection<PersonalData>('personal-data');

    const newData = {
      id: uuid(),
      userId: user.id,
      createdAt: new Date(),
      ...requestBody,
    };

    await collection.insertOne(newData);

    return new OkResponse(omitIdsForOne(newData), 201);
  } catch (e) {
    return new UnknownErrorResponse(e);
  } finally {
    await dbManager.closeMongoClient();
  }
}
