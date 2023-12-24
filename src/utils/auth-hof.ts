import { Context } from '@netlify/functions';
import { Db } from 'mongodb';
import { User } from '../types/users.js';
import { verifyToken } from './crypt-jwt.js';
import { NotFoundErrorResponse, UnauthorizedErrorResponse } from './response.js';

export async function withAuthentication(
  run: (req: Request, context: Context, db: Db, user: User) => Promise<Response>
) {
  return async (req: Request, context: Context, db: Db) => await authenticate(run, req, context, db);
}

async function authenticate(
  nextStepFunction: (req: Request, context: Context, db: Db, user: User) => Promise<Response>,
  req: Request,
  context: Context,
  db: Db
): Promise<Response> {
  try {
    const token = req.headers.get('Authorization')?.split('Bearer ')[1] ?? '';
    const payload = verifyToken(token);
    if (!payload) throw new Error();
    const { email, userId } = payload;
    const user = await db.collection<User>('users').findOne({ id: userId });
    if (!user) return new NotFoundErrorResponse('User');
    if (email !== user.email) throw new Error();
    return await nextStepFunction(req, context, db, user);
  } catch (_e) {
    return new UnauthorizedErrorResponse('Access token is invalid');
  }
}
