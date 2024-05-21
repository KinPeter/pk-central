import { MongoDbManager } from '../../utils/mongo-db-manager';
import {
  MethodNotAllowedResponse,
  OkResponse,
  UnauthorizedErrorResponse,
  UnknownErrorResponse,
  UserNotFoundErrorResponse,
  ValidationErrorResponse,
} from '../../utils/response';
import { ApiError, AuthData, passwordAuthRequestSchema, User } from 'pk-common';
import { getAccessToken, validatePassword } from '../../utils/crypt-jwt';

export async function passwordLogin(req: Request, dbManager: MongoDbManager): Promise<Response> {
  try {
    if (req.method !== 'POST') return new MethodNotAllowedResponse(req.method);

    const body = await req.json();

    try {
      await passwordAuthRequestSchema.validate(body);
    } catch (e: any) {
      return new ValidationErrorResponse(e);
    }

    const { db } = await dbManager.getMongoDb();

    const { email, password } = body;

    const users = db.collection<User>('users');
    const user = await users.findOne({ email });

    if (!user) return new UserNotFoundErrorResponse();

    const { id, passwordHash, passwordSalt } = user;
    if (!passwordHash || !passwordSalt) {
      return new UnauthorizedErrorResponse(ApiError.INVALID_PASSWORD);
    }
    const isPasswordValid = await validatePassword(password, passwordHash, passwordSalt);
    if (!isPasswordValid) {
      return new UnauthorizedErrorResponse(ApiError.INVALID_PASSWORD);
    }

    const { token, expiresAt } = getAccessToken(email, id);
    return new OkResponse<AuthData>({ id, email, token, expiresAt });
  } catch (e) {
    console.log(e);
    return new UnknownErrorResponse(e);
  } finally {
    await dbManager.closeMongoClient();
  }
}
