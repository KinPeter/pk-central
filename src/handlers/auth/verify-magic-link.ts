import { Context } from '../../../server/types';
import { MongoDbManager } from '../../utils/mongo-db-manager';
import {
  MethodNotAllowedResponse,
  UnauthorizedErrorResponse,
  UnknownErrorResponse,
  UserNotFoundErrorResponse,
  ValidationErrorResponse,
} from '../../utils/response';
import { getAccessToken, verifyToken } from '../../utils/crypt-jwt';
import { ApiError, magicLinkParamsSchema, User } from '../../../common';
import { DbCollection } from '../../utils/collections';

export async function verifyMagicLink(req: Request, context: Context, dbManager: MongoDbManager): Promise<Response> {
  try {
    if (req.method !== 'GET') return new MethodNotAllowedResponse(req.method);

    try {
      await magicLinkParamsSchema.validate(context.params);
    } catch (e: any) {
      return new ValidationErrorResponse(e);
    }

    const { token: magicLinkToken, redirectEnv } = context.params;

    const payload = verifyToken(magicLinkToken);
    if (!payload) return new UnauthorizedErrorResponse(ApiError.INVALID_MAGIC_LINK);
    const { userId: id } = payload;

    const { db } = await dbManager.getMongoDb();

    const users = db.collection<User>(DbCollection.USERS);
    const user = await users.findOne({ id });
    if (!user) return new UserNotFoundErrorResponse();

    const { token, expiresAt } = getAccessToken(user.email, user.id);

    const frontendUrl =
      redirectEnv === 'prod' ? process.env.TRIPZ_FRONTEND_URL : redirectEnv === 'dev' ? 'http://localhost:5100' : '';
    const redirectUrl = `${frontendUrl}?accessToken=${token}&expiresAt=${expiresAt}&email=${user.email}&id=${user.id}`;
    return Response.redirect(redirectUrl, 301);
  } catch (e) {
    return new UnknownErrorResponse(e);
  } finally {
    await dbManager.closeMongoClient();
  }
}
