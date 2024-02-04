import { MongoDbManager } from '../../utils/mongo-db-manager';
import {
  MethodNotAllowedResponse,
  OkResponse,
  UnauthorizedErrorResponse,
  UnknownErrorResponse,
  UserNotFoundErrorResponse,
  ValidationErrorResponse,
} from '../../utils/response';
import { getAccessToken, validateLoginCode } from '../../utils/crypt-jwt';
import { ApiError, AuthData, loginVerifyRequestSchema, User } from 'pk-common';

export async function verifyLoginCode(req: Request, dbManager: MongoDbManager): Promise<Response> {
  try {
    if (req.method !== 'POST') return new MethodNotAllowedResponse(req.method);

    const body = await req.json();

    try {
      await loginVerifyRequestSchema.validate(body);
    } catch (e: any) {
      return new ValidationErrorResponse(e);
    }

    const { db } = await dbManager.getMongoDb();

    const { email, loginCode } = body;

    const users = db.collection<User>('users');
    const user = await users.findOne({ email });
    if (!user) return new UserNotFoundErrorResponse();

    const { id, loginCodeExpires, loginCode: hashedLoginCode, salt } = user;
    if (!hashedLoginCode || !salt || !loginCodeExpires) {
      return new UnauthorizedErrorResponse(ApiError.INVALID_LOGIN_CODE);
    }
    const loginCodeValidity = await validateLoginCode(loginCode, salt, hashedLoginCode, loginCodeExpires);
    if (loginCodeValidity !== 'valid') {
      return new UnauthorizedErrorResponse(
        loginCodeValidity === 'invalid' ? ApiError.INVALID_LOGIN_CODE : ApiError.EXPIRED_LOGIN_CODE
      );
    }

    const { token, expiresAt } = getAccessToken(email, id);
    return new OkResponse<AuthData>({ id, email, token, expiresAt });
  } catch (e) {
    return new UnknownErrorResponse(e);
  } finally {
    await dbManager.closeMongoClient();
  }
}
