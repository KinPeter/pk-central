import { MongoDbManager } from '../../utils/mongo-db-manager.js';
import { AuthManager } from '../../utils/auth-manager.js';
import {
  OkResponse,
  UnauthorizedInvalidAccessTokenErrorResponse,
  UnknownErrorResponse,
  ValidationErrorResponse,
} from '../../utils/response.js';
import { PkStartSettings, pkStartSettingsSchema } from 'pk-common';
import { omitIdsForOne } from '../../utils/omit-ids.js';
import { v4 as uuid } from 'uuid';
import { toPkStartSettingsRequest } from '../../utils/request-mappers.js';

export async function updateSettings(
  req: Request,
  dbManager: MongoDbManager,
  authManager: AuthManager
): Promise<Response> {
  try {
    const { db } = await dbManager.getMongoDb();
    const user = await authManager.authenticateUser(req, db);
    if (!user) return new UnauthorizedInvalidAccessTokenErrorResponse();

    const requestBody = await req.json();

    try {
      await pkStartSettingsSchema.validate(requestBody);
    } catch (e: any) {
      return new ValidationErrorResponse(e);
    }

    const collection = db.collection<PkStartSettings>('start-settings');
    const existingSettings = await collection.findOne({ userId: user.id });
    let settings: PkStartSettings;
    const doc: Partial<PkStartSettings> = toPkStartSettingsRequest(requestBody);

    if (!existingSettings) {
      doc.id = uuid();
      doc.userId = user.id;
      await collection.insertOne(doc as PkStartSettings);
      settings = doc as PkStartSettings;
    } else {
      settings = (await collection.findOneAndUpdate(
        { id: existingSettings.id },
        { $set: { ...doc } },
        { returnDocument: 'after' }
      )) as PkStartSettings;
    }

    return new OkResponse(omitIdsForOne(settings));
  } catch (e) {
    return new UnknownErrorResponse(e);
  } finally {
    await dbManager.closeMongoClient();
  }
}
