import { MongoDbManager } from '../../utils/mongo-db-manager.js';
import { AuthManager } from '../../utils/auth-manager.js';
import {
  UnauthorizedInvalidAccessTokenErrorResponse,
  MethodNotAllowedResponse,
  OkResponse,
  UnknownErrorResponse,
} from '../../utils/response.js';
import { omitIds } from '../../utils/omit-ids.js';
import { FlightDocument } from 'pk-common';

export async function getAllFlights(
  req: Request,
  dbManager: MongoDbManager,
  authManager: AuthManager
): Promise<Response> {
  try {
    if (req.method !== 'GET') return new MethodNotAllowedResponse(req.method);

    const { db } = await dbManager.getMongoDb();
    const user = await authManager.authenticateUser(req, db);
    if (!user) return new UnauthorizedInvalidAccessTokenErrorResponse();

    const collection = db.collection<FlightDocument>('flights');
    const cursor = collection.find({ userId: user.id });
    const results = await cursor.toArray();

    return new OkResponse(omitIds(results));
  } catch (e) {
    return new UnknownErrorResponse(e);
  } finally {
    await dbManager.closeMongoClient();
  }
}
