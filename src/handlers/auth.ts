import { Context } from '@netlify/functions';
import { Db } from 'mongodb';
import { ErrorResponse, OkResponse, ValidationErrorResponse } from '../utils/response.js';
import { sendLoginCode, sendSignupNotification } from '../utils/email.js';
import { emailRequestSchema } from '../validators/auth.js';
import { v4 as uuid } from 'uuid';

export async function requestLoginCode(req: Request, _context: Context, db: Db): Promise<Response> {
  try {
    const body = await req.json();

    try {
      await emailRequestSchema.validate(body);
    } catch (e: any) {
      return new ValidationErrorResponse(e);
    }

    const { email } = body;
    const users = db.collection('users');
    const existingUser = await users.findOne({ email });
    let userId!: string;

    if (!existingUser) {
      const id = uuid();
      userId = id;
      await users.insertOne({ id, email });
      sendSignupNotification(email).then(); // no need to await this
    } else {
      console.log('found user', existingUser);
      userId = existingUser.id;
    }

    // await sendLoginCode(body.email, '123456');
    return new OkResponse({ hello: userId, operation: _context.params.operation });
  } catch (e) {
    return new ErrorResponse('Something went wrong', 500, e);
  }
}

export async function verifyLogin(_req: Request, context: Context, _db: Db): Promise<Response> {
  return new OkResponse({ hello: 'world', operation: context.params.operation });
}

export async function refreshToken(_req: Request, context: Context, _db: Db): Promise<Response> {
  return new OkResponse({ hello: 'world', operation: context.params.operation });
}
