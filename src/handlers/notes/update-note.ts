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
import { NoteRequest, Note, noteSchema, UUID, ValidationError } from 'pk-common';
import { omitIdsForOne } from '../../utils/omit-ids';
import * as yup from 'yup';

export async function updateNote(
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

    const requestBody: NoteRequest = await req.json();

    try {
      await noteSchema.validate(requestBody);
    } catch (e: any) {
      return new ValidationErrorResponse(e);
    }

    const collection = db.collection<Note>('notes');

    const result = await collection.findOneAndUpdate(
      { id, userId: user.id },
      { $set: { ...requestBody } },
      { returnDocument: 'after' }
    );
    if (!result) return new NotFoundErrorResponse('Note');

    return new OkResponse(omitIdsForOne(result));
  } catch (e) {
    return new UnknownErrorResponse(e);
  } finally {
    await dbManager.closeMongoClient();
  }
}
