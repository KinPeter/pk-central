import { getEnv } from '../../utils/environment';
import { MongoDbManager } from '../../utils/mongo-db-manager';
import { AuthManager } from '../../utils/auth-manager';
import {
  NotFoundErrorResponse,
  OkResponse,
  UnauthorizedInvalidAccessTokenErrorResponse,
  UnknownErrorResponse,
  ValidationErrorResponse,
} from '../../utils/response';
import { PkStartSettingsRequest, PkStartSettingsResource, pkStartSettingsSchema } from '../../../common';
import { omitIdsForOne } from '../../utils/omit-ids';
import { v4 as uuid } from 'uuid';
import { toPkStartSettingsRequest } from '../../utils/request-mappers';
import { DbCollection } from '../../utils/collections';

export async function updateSettings(
  req: Request,
  dbManager: MongoDbManager,
  authManager: AuthManager
): Promise<Response> {
  try {
    const { db } = await dbManager.getMongoDb();
    const user = await authManager.authenticateUser(req, db);
    if (!user) return new UnauthorizedInvalidAccessTokenErrorResponse();

    const requestBody = (await req.json()) as PkStartSettingsRequest;

    try {
      await pkStartSettingsSchema.validate(requestBody);
    } catch (e: any) {
      return new ValidationErrorResponse(e);
    }

    const [openWeatherApiKey, locationIqApiKey, unsplashApiKey, stravaClientId, stravaClientSecret] = getEnv(
      'OPEN_WEATHER_MAP_API_KEY',
      'LOCATION_IQ_API_KEY',
      'UNSPLASH_API_KEY',
      'STRAVA_CLIENT_ID',
      'STRAVA_CLIENT_SECRET'
    );
    if (!openWeatherApiKey || !locationIqApiKey || !unsplashApiKey || !stravaClientId || !stravaClientSecret) {
      return new NotFoundErrorResponse('API keys');
    }

    const collection = db.collection<PkStartSettingsResource>(DbCollection.START_SETTINGS);
    const existingSettings = await collection.findOne({ userId: user.id });
    let settings: PkStartSettingsResource;
    const doc: Partial<PkStartSettingsResource> = toPkStartSettingsRequest(requestBody);

    if (!existingSettings) {
      doc.id = uuid();
      doc.userId = user.id;
      await collection.insertOne(doc as PkStartSettingsResource);
      settings = doc as PkStartSettingsResource;
    } else {
      settings = (await collection.findOneAndUpdate(
        { id: existingSettings.id },
        { $set: { ...doc } },
        { returnDocument: 'after' }
      )) as PkStartSettingsResource;
    }

    const result = {
      ...(omitIdsForOne(settings) as object),
      openWeatherApiKey,
      locationIqApiKey,
      unsplashApiKey,
      stravaClientId,
      stravaClientSecret,
    };

    return new OkResponse(result);
  } catch (e) {
    return new UnknownErrorResponse(e);
  } finally {
    await dbManager.closeMongoClient();
  }
}
