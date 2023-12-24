import { Context } from '@netlify/functions';
import { Db } from 'mongodb';
import {
  ErrorResponse,
  MethodNotAllowedResponse,
  NotFoundErrorResponse,
  OkResponse,
  UnauthorizedErrorResponse,
  ValidationErrorResponse,
} from '../utils/response.js';
import { sendLoginCode, sendSignupNotification } from '../utils/email.js';
import { emailRequestSchema, loginVerifyRequestSchema } from '../validators/auth.js';
import { v4 as uuid } from 'uuid';
import { User } from '../types/users.js';
import {
  getLoginCode,
  getAccessToken,
  validateLoginCode,
  verifyToken,
} from '../utils/crypt-jwt.js';

export async function requestLoginCode(req: Request, _context: Context, db: Db): Promise<Response> {
  try {
    // if (req.method !== 'POST') return new MethodNotAllowedResponse(req.method);

    const body = await req.json();

    try {
      await emailRequestSchema.validate(body);
    } catch (e: any) {
      return new ValidationErrorResponse(e);
    }

    const { email } = body;
    const users = db.collection<User>('users');
    const existingUser = await users.findOne({ email });
    let user: User;

    if (!existingUser) {
      const id = uuid();
      user = { id, email };
      await users.insertOne({ id, email });
      console.log('Created new user:', email, id);
      sendSignupNotification(email).then(); // no need to await this
    } else {
      user = existingUser;
    }

    const { loginCode, hashedLoginCode, loginCodeExpires, salt, magicLinkToken } =
      await getLoginCode(user.id);
    await users.updateOne(
      { id: user.id },
      {
        $set: {
          loginCode: hashedLoginCode,
          loginCodeExpires,
          salt,
        },
      }
    );

    await sendLoginCode(body.email, loginCode, magicLinkToken);
    return new OkResponse({ message: 'Check your inbox' });
  } catch (e) {
    return new ErrorResponse('Something went wrong', 500, e);
  }
}

export async function verifyLoginCode(req: Request, _context: Context, db: Db): Promise<Response> {
  try {
    if (req.method !== 'POST') return new MethodNotAllowedResponse(req.method);

    const body = await req.json();

    try {
      await loginVerifyRequestSchema.validate(body);
    } catch (e: any) {
      return new ValidationErrorResponse(e);
    }

    const { email, loginCode } = body;

    const users = db.collection<User>('users');
    const user = await users.findOne({ email });
    if (!user) {
      return new NotFoundErrorResponse('User');
    }

    const { id, loginCodeExpires, loginCode: hashedLoginCode, salt } = user;
    if (!hashedLoginCode || !salt || !loginCodeExpires) {
      return new UnauthorizedErrorResponse('Cannot validate login code, no entry in the database');
    }
    const loginCodeValidity = await validateLoginCode(
      loginCode,
      salt,
      hashedLoginCode,
      loginCodeExpires
    );
    if (loginCodeValidity !== 'valid') {
      return new UnauthorizedErrorResponse(
        loginCodeValidity === 'invalid' ? 'Invalid login code' : 'Login code expired'
      );
    }

    const { token, expiresAt } = getAccessToken(email, id);
    return new OkResponse({ id, email, token, expiresAt });
  } catch (e) {
    return new ErrorResponse('Something went wrong', 500, e);
  }
}

export async function verifyMagicLink(req: Request, context: Context, db: Db): Promise<Response> {
  try {
    if (req.method !== 'GET') return new MethodNotAllowedResponse(req.method);

    const { token: magicLinkToken, redirectEnv } = context.params;

    const payload = verifyToken(magicLinkToken);
    if (!payload) return new UnauthorizedErrorResponse('Magic link token is invalid or expired');
    const { userId: id } = payload;

    const users = db.collection<User>('users');
    const user = await users.findOne({ id });
    if (!user) {
      return new NotFoundErrorResponse('User');
    }

    const { token, expiresAt } = getAccessToken(user.email, user.id);

    const frontendUrl =
      redirectEnv === 'prod'
        ? process.env.FRONTEND_URL
        : redirectEnv === 'dev'
          ? 'http://localhost:5100'
          : '';
    const redirectUrl = `${frontendUrl}?accessToken=${token}&expiresAt=${expiresAt}&email=${user.email}&id=${user.id}`;
    return Response.redirect(redirectUrl, 301);
  } catch (e) {
    return new ErrorResponse('Something went wrong', 500, e);
  }
}

export async function refreshToken(
  req: Request,
  _context: Context,
  _db: Db,
  user: User
): Promise<Response> {
  if (req.method !== 'POST') return new MethodNotAllowedResponse(req.method);
  const { email, id } = user;
  const { token, expiresAt } = getAccessToken(email, id);
  return new OkResponse({ id, email, token, expiresAt });
}
