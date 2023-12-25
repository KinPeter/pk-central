import { Config, Context } from '@netlify/functions';
import { CorsOkResponse, ErrorResponse } from '../src/utils/response.js';
import { MongoDbManager } from '../src/utils/mongo-db-manager.js';
import { AuthManager } from '../src/utils/auth-manager.js';
import { EmailManager } from '../src/utils/email-manager.js';
import { createTransport } from 'nodemailer';
import { requestLoginCode } from '../src/handlers/auth/request-login-code.js';
import { verifyLoginCode } from '../src/handlers/auth/verify-login-code.js';
import { verifyMagicLink } from '../src/handlers/auth/verify-magic-link.js';
import { refreshToken } from '../src/handlers/auth/refresh-token.js';

export const config: Config = {
  path: ['/auth/:operation', '/auth/:operation/:token/:redirectEnv'],
  method: ['GET', 'POST', 'OPTIONS'],
};

export default async (req: Request, context: Context) => {
  if (req.method === 'OPTIONS') return new CorsOkResponse();

  const { operation } = context.params;
  const dbManager = new MongoDbManager();

  switch (operation) {
    case 'login':
      return await requestLoginCode(req, dbManager, new EmailManager(createTransport));
    case 'verify-code':
      return await verifyLoginCode(req, dbManager);
    case 'verify-link':
      return await verifyMagicLink(req, context, dbManager);
    case 'token-refresh':
      return await refreshToken(req, dbManager, new AuthManager());
    default:
      return new ErrorResponse(`Unknown operation: /auth/${operation}`, 400);
  }
};
