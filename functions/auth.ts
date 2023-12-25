import { Config, Context } from '@netlify/functions';
import { CorsOkResponse, ErrorResponse } from '../src/utils/response.js';
import { refreshToken, requestLoginCode, verifyLoginCode, verifyMagicLink } from '../src/handlers/auth.js';
import { MongoDbManager } from '../src/utils/mongo-db-manager.js';
import { AuthManager } from '../src/utils/auth-manager.js';

export const config: Config = {
  path: ['/auth/:operation', '/auth/:operation/:token/:redirectEnv'],
  method: ['GET', 'POST', 'OPTIONS'],
};

export default async (req: Request, context: Context) => {
  if (req.method === 'OPTIONS') return new CorsOkResponse();

  const { operation } = context.params;
  const dbManager = new MongoDbManager();
  const authManager = new AuthManager();

  switch (operation) {
    case 'login':
      return await requestLoginCode(req, context, dbManager);
    case 'verify-code':
      return await verifyLoginCode(req, context, dbManager);
    case 'verify-link':
      return await verifyMagicLink(req, context, dbManager);
    case 'token-refresh':
      return await refreshToken(req, context, dbManager, authManager);
    default:
      return new ErrorResponse(`Unknown operation: /auth/${operation}`, 400);
  }
};
