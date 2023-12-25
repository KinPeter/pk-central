import { MongoDbManager } from '../../utils/mongo-db-manager.js';
import {
  ErrorResponse,
  MethodNotAllowedResponse,
  NotFoundErrorResponse,
  OkResponse,
  UnauthorizedErrorResponse,
  ValidationErrorResponse,
} from '../../utils/response.js';
import { loginVerifyRequestSchema } from '../../validators/auth.js';
import { User } from '../../types/users.js';
import { getAccessToken, validateLoginCode } from '../../utils/crypt-jwt.js';

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
    if (!user) return new NotFoundErrorResponse('User');

    const { id, loginCodeExpires, loginCode: hashedLoginCode, salt } = user;
    if (!hashedLoginCode || !salt || !loginCodeExpires) {
      return new UnauthorizedErrorResponse('Cannot validate login code, no entry in the database');
    }
    const loginCodeValidity = await validateLoginCode(loginCode, salt, hashedLoginCode, loginCodeExpires);
    if (loginCodeValidity !== 'valid') {
      return new UnauthorizedErrorResponse(
        loginCodeValidity === 'invalid' ? 'Invalid login code' : 'Login code expired'
      );
    }

    const { token, expiresAt } = getAccessToken(email, id);
    return new OkResponse({ id, email, token, expiresAt });
  } catch (e) {
    return new ErrorResponse('Something went wrong', 500, e);
  } finally {
    await dbManager.closeMongoClient();
  }
}
