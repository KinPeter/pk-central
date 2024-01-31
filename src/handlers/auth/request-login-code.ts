import { MongoDbManager } from '../../utils/mongo-db-manager.js';
import { EmailManager } from '../../utils/email-manager.js';
import {
  MethodNotAllowedResponse,
  OkResponse,
  UnknownErrorResponse,
  ValidationErrorResponse,
} from '../../utils/response.js';
import { v4 as uuid } from 'uuid';
import { getLoginCode } from '../../utils/crypt-jwt.js';
import { emailRequestSchema, User } from 'pk-common';

export async function requestLoginCode(
  req: Request,
  dbManager: MongoDbManager,
  emailManager: EmailManager
): Promise<Response> {
  try {
    if (req.method !== 'POST') return new MethodNotAllowedResponse(req.method);

    const body = await req.json();

    try {
      await emailRequestSchema.validate(body);
    } catch (e: any) {
      return new ValidationErrorResponse(e);
    }

    const { db } = await dbManager.getMongoDb();

    const { email } = body;
    const users = db.collection<User>('users');
    const existingUser = await users.findOne({ email });
    let user: User;

    if (!existingUser) {
      const id = uuid();
      user = { id, email };
      await users.insertOne({ id, email });
      console.log('Created new user:', email, id);
      emailManager.sendSignupNotification(email).then(); // no need to await this
    } else {
      user = existingUser;
    }

    const { loginCode, hashedLoginCode, loginCodeExpires, salt, magicLinkToken } = await getLoginCode(user.id);
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

    await emailManager.sendLoginCode(body.email, loginCode, magicLinkToken);
    return new OkResponse({ message: 'Check your inbox' });
  } catch (e) {
    console.log(e);
    return new UnknownErrorResponse(e);
  } finally {
    await dbManager.closeMongoClient();
  }
}
