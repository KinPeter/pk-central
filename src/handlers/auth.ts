import { Context } from '@netlify/functions';
import { Db } from 'mongodb';
import {
  ErrorResponse,
  NotFoundErrorResponse,
  OkResponse,
  UnauthorizedErrorResponse,
  ValidationErrorResponse,
} from '../utils/response.js';
import { sendLoginCode, sendSignupNotification } from '../utils/email.js';
import { emailRequestSchema, loginVerifyRequestSchema } from '../validators/auth.js';
import { v4 as uuid } from 'uuid';
import { User } from '../types/users.js';
import { getLoginCode, getToken, validateLoginCode } from '../utils/crypt-jwt.js';

export async function requestLoginCode(req: Request, _context: Context, db: Db): Promise<Response> {
  try {
    const body = await req.json();
    console.debug('Got body', body);
    try {
      await emailRequestSchema.validate(body);
    } catch (e: any) {
      return new ValidationErrorResponse(e);
    }
    console.debug('Validated body');

    const { email } = body;
    const users = db.collection<User>('users');
    console.debug('Got collection', users.collectionName);

    let existingUser;
    try {
      existingUser = await users.findOne({ email });
      console.debug('Existing user:', existingUser);
    } catch (e) {
      console.error(e);
      return new NotFoundErrorResponse('User'); // TODO remove- debug
    }
    let user: User;

    if (!existingUser) {
      const id = uuid();
      user = { id, email };
      await users.insertOne({ id, email });
      sendSignupNotification(email).then(); // no need to await this
    } else {
      user = existingUser;
    }

    const { loginCode, hashedLoginCode, loginCodeExpires, salt } = await getLoginCode();
    console.debug('Got login code', loginCode);
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
    console.debug('Updated user entry');

    await sendLoginCode(body.email, loginCode);
    return new OkResponse({ message: 'Check your inbox' });
  } catch (e) {
    return new ErrorResponse('Something went wrong', 500, e);
  }
}

export async function verifyLogin(req: Request, context: Context, db: Db): Promise<Response> {
  try {
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

    const { token, expiresAt } = getToken(email, id);
    return new OkResponse({ id, email, token, expiresAt });
  } catch (e) {
    return new ErrorResponse('Something went wrong', 500, e);
  }
}

export async function refreshToken(
  _req: Request,
  _context: Context,
  _db: Db,
  user: User
): Promise<Response> {
  const { email, id } = user;
  const { token, expiresAt } = getToken(email, id);
  return new OkResponse({ id, email, token, expiresAt });
}
