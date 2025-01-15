import { MongoDbManager } from '../../utils/mongo-db-manager';
import {
  ForbiddenOperationErrorResponse,
  MethodNotAllowedResponse,
  OkResponse,
  UnknownErrorResponse,
  ValidationErrorResponse,
} from '../../utils/response';
import { v4 as uuid } from 'uuid';
import { getLoginCode } from '../../utils/crypt-jwt';
import { EmailRequest, emailRequestSchema, User } from '../../../common';
import { DbCollection } from '../../utils/collections';
import process from 'node:process';

export async function instantLoginCode(req: Request, dbManager: MongoDbManager): Promise<Response> {
  try {
    if (req.method !== 'POST') return new MethodNotAllowedResponse(req.method);
    if (process.env.PK_ENV !== 'dev') return new ForbiddenOperationErrorResponse();

    const body = (await req.json()) as EmailRequest;

    try {
      await emailRequestSchema.validate(body);
    } catch (e: any) {
      return new ValidationErrorResponse(e);
    }

    const { db } = await dbManager.getMongoDb();

    const { email } = body;
    console.warn(`[DEV] ${email} is getting instant login code on '${process.env.PK_ENV}' env`);

    const isEmailRestricted = process.env.EMAILS_ALLOWED !== 'all';
    const emailsAllowed = process.env.EMAILS_ALLOWED?.split(',');
    if (isEmailRestricted && emailsAllowed && Array.isArray(emailsAllowed) && !emailsAllowed.includes(email)) {
      return new ForbiddenOperationErrorResponse('Sign up');
    }

    const users = db.collection<User>(DbCollection.USERS);
    const existingUser = await users.findOne({ email });
    let user: User;

    if (!existingUser) {
      const id = uuid();
      user = { id, email, createdAt: new Date() };
      await users.insertOne(user);
      console.log('Created new user:', email, id);
    } else {
      user = existingUser;
    }

    const { loginCode, hashedLoginCode, loginCodeExpires, salt } = await getLoginCode(user.id);
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

    return new OkResponse({ loginCode: loginCode });
  } catch (e) {
    console.log(e);
    return new UnknownErrorResponse(e);
  } finally {
    await dbManager.closeMongoClient();
  }
}
