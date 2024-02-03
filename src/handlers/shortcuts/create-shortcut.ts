import { MongoDbManager } from '../../utils/mongo-db-manager.js';
import { AuthManager } from '../../utils/auth-manager.js';
import {
  OkResponse,
  UnauthorizedInvalidAccessTokenErrorResponse,
  UnknownErrorResponse,
  ValidationErrorResponse,
} from '../../utils/response.js';
import { v4 as uuid } from 'uuid';
import { omitIdsForOne } from '../../utils/omit-ids.js';
import { Shortcut, ShortcutRequest, shortcutSchema } from 'pk-common';

export async function createShortcut(
  req: Request,
  dbManager: MongoDbManager,
  authManager: AuthManager
): Promise<Response> {
  try {
    const { db } = await dbManager.getMongoDb();
    const user = await authManager.authenticateUser(req, db);
    if (!user) return new UnauthorizedInvalidAccessTokenErrorResponse();

    const requestBody: ShortcutRequest = await req.json();

    try {
      await shortcutSchema.validate(requestBody);
    } catch (e: any) {
      return new ValidationErrorResponse(e);
    }

    const collection = db.collection<Shortcut>('shortcuts');

    const newShortcut = {
      id: uuid(),
      userId: user.id,
      createdAt: new Date(),
      ...requestBody,
    };

    await collection.insertOne(newShortcut);

    return new OkResponse(omitIdsForOne(newShortcut), 201);
  } catch (e) {
    return new UnknownErrorResponse(e);
  } finally {
    await dbManager.closeMongoClient();
  }
}
