import { Config, Context } from '@netlify/functions';
import { CorsOkResponse, UnknownOperationErrorResponse } from '../src/utils/response';
import { MongoDbManager } from '../src/utils/mongo-db-manager';
import { AuthManager } from '../src/utils/auth-manager';
import { EmailManager } from '../src/utils/email-manager';
import { createTransport } from 'nodemailer';
import { requestLoginCode } from '../src/handlers/auth/request-login-code';
import { verifyLoginCode } from '../src/handlers/auth/verify-login-code';
import { verifyMagicLink } from '../src/handlers/auth/verify-magic-link';
import { refreshToken } from '../src/handlers/auth/refresh-token';
import { instantLoginCode } from '../src/handlers/auth/instant-login-code';
import { passwordLogin } from '../src/handlers/auth/password-login';
import { passwordSignup } from '../src/handlers/auth/password-signup';
import { setPassword } from '../src/handlers/auth/set-password';

export const config: Config = {
  path: ['/auth/:operation', '/auth/:operation/:token/:redirectEnv'],
  method: ['GET', 'POST', 'PUT', 'OPTIONS'],
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
    case 'password-login':
      return await passwordLogin(req, dbManager);
    case 'password-signup':
      return await passwordSignup(req, dbManager, new EmailManager(createTransport));
    case 'set-password':
      return await setPassword(req, dbManager, new AuthManager());
    case 'instant-login-code':
      // FOR TESTING PURPOSES ONLY! WORKS ON DEV ENV ONLY!
      return await instantLoginCode(req, dbManager);
    default:
      return new UnknownOperationErrorResponse(`/auth/${operation}`);
  }
};
