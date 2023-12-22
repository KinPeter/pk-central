import { Context } from '@netlify/functions';
import { Db } from 'mongodb';

export type User = {
  id: string;
};

export async function withAuthentication(
  run: (req: Request, context: Context, db: Db, user: User) => Promise<Response>
) {
  return async (req: Request, context: Context, db: Db) =>
    await authenticate(run, req, context, db);
}

async function authenticate(
  nextStepFunction: (req: Request, context: Context, db: Db, user: User) => Promise<Response>,
  req: Request,
  context: Context,
  db: Db
): Promise<Response> {
  const user = { id: 'hello-world' };
  // TODO get auth header, look up user, return user
  return await nextStepFunction(req, context, db, user);
}
