import { getEnv } from '../../utils/environment';
import { MongoDbManager } from '../../utils/mongo-db-manager';
import { AuthManager } from '../../utils/auth-manager';
import {
  UnauthorizedInvalidAccessTokenErrorResponse,
  OkResponse,
  NotFoundErrorResponse,
  UnknownErrorResponse,
} from '../../utils/response';
import { omitIdsForOne } from '../../utils/omit-ids';
import { PkStartSettingsResource } from '../../../common';
import { DbCollection } from '../../utils/collections';

export async function getSettings(
  req: Request,
  dbManager: MongoDbManager,
  authManager: AuthManager
): Promise<Response> {
  try {
    const { db } = await dbManager.getMongoDb();
    const user = await authManager.authenticateUser(req, db);
    if (!user) return new UnauthorizedInvalidAccessTokenErrorResponse();

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
    const settings = await collection.findOne({ userId: user.id });
    if (!settings) return new NotFoundErrorResponse('Start settings for user');

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
