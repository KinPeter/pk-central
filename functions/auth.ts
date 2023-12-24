import { Config, Context } from '@netlify/functions';
import { withMongoDb } from '../src/utils/mongo-hof.js';
import { CorsOkResponse, ErrorResponse } from '../src/utils/response.js';
import { withAuthentication } from '../src/utils/auth-hof.js';
import { refreshToken, requestLoginCode, verifyLoginCode, verifyMagicLink } from '../src/handlers/auth.js';

export const config: Config = {
  path: ['/auth/:operation', '/auth/:operation/:token/:redirectEnv'],
  method: ['GET', 'POST', 'OPTIONS'],
};

export default async (req: Request, context: Context) => {
  if (req.method === 'OPTIONS') return new CorsOkResponse();

  const { operation } = context.params;

  switch (operation) {
    case 'login':
      return await withMongoDb(requestLoginCode, req, context);
    case 'verify-code':
      return await withMongoDb(verifyLoginCode, req, context);
    case 'verify-link':
      return await withMongoDb(verifyMagicLink, req, context);
    case 'token-refresh':
      return await withMongoDb(await withAuthentication(refreshToken), req, context);
    default:
      return new ErrorResponse(`Unknown operation: /auth/${operation}`, 400);
  }
};
