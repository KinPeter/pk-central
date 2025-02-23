import { createInitialActivities, createInitialStartSettings } from '../../utils/create-initial-data';
import { getEnv } from '../../utils/environment';
import { MongoDbManager } from '../../utils/mongo-db-manager';
import { EmailManager } from '../../utils/email-manager';
import {
  ConflictErrorResponse,
  ForbiddenOperationErrorResponse,
  MethodNotAllowedResponse,
  OkResponse,
  UnknownErrorResponse,
  ValidationErrorResponse,
} from '../../utils/response';
import { v4 as uuid } from 'uuid';
import { getHashed } from '../../utils/crypt-jwt';
import { ApiError, IdObject, PasswordAuthRequest, passwordAuthRequestSchema, User } from '../../../common';
import { DbCollection } from '../../utils/collections';

export async function passwordSignup(
  req: Request,
  dbManager: MongoDbManager,
  emailManager: EmailManager
): Promise<Response> {
  try {
    if (req.method !== 'POST') return new MethodNotAllowedResponse(req.method);

    const body = (await req.json()) as PasswordAuthRequest;

    try {
      await passwordAuthRequestSchema.validate(body);
    } catch (e: any) {
      return new ValidationErrorResponse(e);
    }

    const { email, password } = body;
    const { db } = await dbManager.getMongoDb();
    const users = db.collection<User>(DbCollection.USERS);
    const existingUser = await users.findOne({ email });

    if (existingUser) {
      return new ConflictErrorResponse(ApiError.EMAIL_REGISTERED);
    }

    const [EMAILS_ALLOWED, PK_ENV] = getEnv('EMAILS_ALLOWED', 'PK_ENV');
    const isEmailRestricted = EMAILS_ALLOWED !== 'all';
    const emailsAllowed = EMAILS_ALLOWED?.split(',');
    if (isEmailRestricted && emailsAllowed && Array.isArray(emailsAllowed) && !emailsAllowed.includes(email)) {
      return new ForbiddenOperationErrorResponse('Sign up');
    }

    const id = uuid();
    const { hashedString: passwordHash, salt: passwordSalt } = await getHashed(password);
    await users.insertOne({ id, email, passwordHash, passwordSalt, createdAt: new Date() });
    console.log('Created new user:', email, id);

    if (PK_ENV !== 'test') {
      emailManager.sendSignupNotification(email).then(); // no need to await this
    }

    await createInitialStartSettings(db, id);
    console.log('Created initial start settings data');
    await createInitialActivities(db, id);
    console.log('Created initial activities data');

    return new OkResponse<IdObject>({ id }, 201);
  } catch (e) {
    console.log(e);
    return new UnknownErrorResponse(e);
  } finally {
    await dbManager.closeMongoClient();
  }
}
