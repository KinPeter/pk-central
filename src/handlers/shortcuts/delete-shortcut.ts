import { MongoDbManager } from '../../utils/mongo-db-manager';
import { AuthManager } from '../../utils/auth-manager';
import {
  ErrorResponse,
  NotFoundErrorResponse,
  OkResponse,
  UnauthorizedInvalidAccessTokenErrorResponse,
  UnknownErrorResponse,
} from '../../utils/response';
import { Shortcut, UUID, ValidationError } from 'pk-common';
import * as yup from 'yup';

export async function deleteShortcut(
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

    const collection = db.collection<Shortcut>('shortcuts');

    const result = await collection.findOneAndDelete({ id, userId: user.id });
    if (!result) return new NotFoundErrorResponse('Shortcut');

    return new OkResponse({ id });
  } catch (e) {
    return new UnknownErrorResponse(e);
  } finally {
    await dbManager.closeMongoClient();
  }
}
