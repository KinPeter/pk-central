import { MongoDbManager } from '../../utils/mongo-db-manager';
import {
  MethodNotAllowedResponse,
  NotFoundErrorResponse,
  OkResponse,
  UnauthorizedInvalidAccessTokenErrorResponse,
  UnknownErrorResponse,
} from '../../utils/response';
import { PkStartSettings } from 'pk-common';
import { AuthManager } from '../../utils/auth-manager';
import { FetchResponseType, HttpClient } from '../../utils/http-client';
import { DbCollection } from '../../utils/collections';

export async function getBirthdays(
  req: Request,
  dbManager: MongoDbManager,
  authManager: AuthManager,
  httpClient: HttpClient
): Promise<Response> {
  try {
    if (req.method !== 'GET') return new MethodNotAllowedResponse(req.method);

    const { db } = await dbManager.getMongoDb();
    const user = await authManager.authenticateUser(req, db);
    if (!user) return new UnauthorizedInvalidAccessTokenErrorResponse();

    const settingsCollection = db.collection<PkStartSettings>(DbCollection.START_SETTINGS);
    const settings = await settingsCollection.findOne({ userId: user.id });
    const birthdaysUrl = settings?.birthdaysUrl;
    if (!birthdaysUrl) return new NotFoundErrorResponse('Birthdays URL');

    const response = await httpClient.get<string>(birthdaysUrl, FetchResponseType.TEXT);
    const lines = response.split(/\r\n/);
    const results = lines.map(line => {
      const entry = line.split(/\t/);
      return {
        name: entry[0],
        date: entry[1],
      };
    });

    return new OkResponse(results);
  } catch (e) {
    return new UnknownErrorResponse(e);
  } finally {
    await dbManager.closeMongoClient();
  }
}
