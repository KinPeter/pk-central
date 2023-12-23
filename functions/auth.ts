import { Config, Context } from '@netlify/functions';
import { withMongoDb } from '../src/utils/mongo-hof.js';
import { ErrorResponse } from '../src/utils/response.js';
import { withAuthentication } from '../src/utils/auth-hof.js';
import { refreshToken, requestLoginCode, verifyLogin } from '../src/handlers/auth.js';

export const config: Config = {
  path: '/auth/:operation',
  method: ['POST', 'OPTIONS'],
};

export default async (req: Request, context: Context) => {
  const { operation } = context.params;

  switch (operation) {
    case 'login':
      return await withMongoDb(requestLoginCode, req, context);
    case 'verify':
      return await withMongoDb(verifyLogin, req, context);
    case 'token-refresh':
      return await withMongoDb(await withAuthentication(refreshToken), req, context);
    default:
      return new ErrorResponse(`Unknown operation: /auth/${operation}`, 400);
  }
};
