import { MongoDbManager } from '../../utils/mongo-db-manager.js';
import { AuthManager } from '../../utils/auth-manager.js';
import {
  ErrorResponse,
  NotFoundErrorResponse,
  OkResponse,
  UnauthorizedInvalidAccessTokenErrorResponse,
  UnknownErrorResponse,
  ValidationErrorResponse,
} from '../../utils/response.js';
import { PersonalDataRequest, PersonalData, personalDataSchema, UUID, ValidationError } from 'pk-common';
import { omitIdsForOne } from '../../utils/omit-ids.js';
import * as yup from 'yup';

export async function updatePersonalData(
  req: Request,
  id: UUID,
  dbManager: MongoDbManager,
  authManager: AuthManager
): Promise<Response> {
  try {
    if (!id || !yup.string().uuid().isValidSync(id)) return new ErrorResponse(ValidationError.INVALID_UUID, 400);

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

    const result = await collection.findOneAndUpdate(
      { id, userId: user.id },
      { $set: { ...requestBody } },
      { returnDocument: 'after' }
    );
    if (!result) return new NotFoundErrorResponse('Personal Data');

    return new OkResponse(omitIdsForOne(result));
  } catch (e) {
    return new UnknownErrorResponse(e);
  } finally {
    await dbManager.closeMongoClient();
  }
}
