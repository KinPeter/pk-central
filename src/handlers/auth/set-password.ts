import { MongoDbManager } from '../../utils/mongo-db-manager';
import { AuthManager } from '../../utils/auth-manager';
import {
  MethodNotAllowedResponse,
  OkResponse,
  UnauthorizedInvalidAccessTokenErrorResponse,
  UnknownErrorResponse,
  ValidationErrorResponse,
} from '../../utils/response';
import { getHashed } from '../../utils/crypt-jwt';
import { IdObject, passwordAuthRequestSchema, User } from 'pk-common';

export async function setPassword(
  req: Request,
  dbManager: MongoDbManager,
  authManager: AuthManager
): Promise<Response> {
  try {
    if (req.method !== 'PUT') return new MethodNotAllowedResponse(req.method);

    const body = await req.json();

    try {
      await passwordAuthRequestSchema.validate(body);
    } catch (e: any) {
      return new ValidationErrorResponse(e);
    }

    const { email, password } = body;

    const { db } = await dbManager.getMongoDb();
    const users = db.collection<User>('users');
    const user = await authManager.authenticateUser(req, db);
    if (!user || user.email !== email) return new UnauthorizedInvalidAccessTokenErrorResponse();

    const { hashedString: passwordHash, salt: passwordSalt } = await getHashed(password);
    await users.updateOne(
      { id: user.id },
      {
        $set: {
          passwordHash,
          passwordSalt,
        },
      }
    );

    return new OkResponse<IdObject>({ id: user.id }, 201);
  } catch (e) {
    return new UnknownErrorResponse(e);
  } finally {
    await dbManager.closeMongoClient();
  }
}
