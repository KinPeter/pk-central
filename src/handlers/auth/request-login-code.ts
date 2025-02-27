import { createInitialActivities, createInitialStartSettings } from '../../utils/create-initial-data';
import { getEnv } from '../../utils/environment';
import { MongoDbManager } from '../../utils/mongo-db-manager';
import { EmailManager } from '../../utils/email-manager';
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

export async function requestLoginCode(
  req: Request,
  dbManager: MongoDbManager,
  emailManager: EmailManager
): Promise<Response> {
  try {
    if (req.method !== 'POST') return new MethodNotAllowedResponse(req.method);

    const body = (await req.json()) as EmailRequest;

    try {
      await emailRequestSchema.validate(body);
    } catch (e: any) {
      return new ValidationErrorResponse(e);
    }

    const { db } = await dbManager.getMongoDb();

    const { email } = body;

    const [EMAILS_ALLOWED] = getEnv('EMAILS_ALLOWED');
    const isEmailRestricted = EMAILS_ALLOWED !== 'all';
    const emailsAllowed = EMAILS_ALLOWED?.split(',');
    if (isEmailRestricted && emailsAllowed && Array.isArray(emailsAllowed) && !emailsAllowed.includes(email)) {
      return new ForbiddenOperationErrorResponse('Sign up');
    }

    const users = db.collection<User>(DbCollection.USERS);
    const existingUser = await users.findOne({ email });
    let user: User;

    if (!existingUser) {
      const id = uuid();
      const createdAt = new Date();
      user = { id, email, createdAt };
      await users.insertOne({ id, email, createdAt });
      console.log('Created new user:', email, id);
      await createInitialStartSettings(db, id);
      console.log('Created initial start settings data');
      await createInitialActivities(db, id);
      console.log('Created initial activities data');
      emailManager.sendSignupNotification(email).then(); // no need to await this
    } else {
      user = existingUser;
    }

    const { loginCode, hashedLoginCode, loginCodeExpires, salt } = await getLoginCode();
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

    await emailManager.sendLoginCode(body.email, loginCode);
    return new OkResponse({ message: 'Check your inbox' });
  } catch (e) {
    console.log(e);
    return new UnknownErrorResponse(e);
  } finally {
    await dbManager.closeMongoClient();
  }
}
