import { Context } from '@netlify/functions';
import { MongoDbManager } from '../../utils/mongo-db-manager.js';
import {
  ErrorResponse,
  MethodNotAllowedResponse,
  NotFoundErrorResponse,
  UnauthorizedErrorResponse,
} from '../../utils/response.js';
import { getAccessToken, verifyToken } from '../../utils/crypt-jwt.js';
import { User } from '../../types/users.js';

export async function verifyMagicLink(req: Request, context: Context, dbManager: MongoDbManager): Promise<Response> {
  try {
    if (req.method !== 'GET') return new MethodNotAllowedResponse(req.method);

    const { token: magicLinkToken, redirectEnv } = context.params;

    const payload = verifyToken(magicLinkToken);
    if (!payload) return new UnauthorizedErrorResponse('Magic link token is invalid or expired');
    const { userId: id } = payload;

    const { db } = await dbManager.getMongoDb();

    const users = db.collection<User>('users');
    const user = await users.findOne({ id });
    if (!user) return new NotFoundErrorResponse('User');

    const { token, expiresAt } = getAccessToken(user.email, user.id);

    const frontendUrl =
      redirectEnv === 'prod' ? process.env.FRONTEND_URL : redirectEnv === 'dev' ? 'http://localhost:5100' : '';
    const redirectUrl = `${frontendUrl}?accessToken=${token}&expiresAt=${expiresAt}&email=${user.email}&id=${user.id}`;
    return Response.redirect(redirectUrl, 301);
  } catch (e) {
    return new ErrorResponse('Something went wrong', 500, e);
  } finally {
    await dbManager.closeMongoClient();
  }
}
