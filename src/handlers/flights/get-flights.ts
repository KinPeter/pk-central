import { Flight } from '../../../common';
import { MongoDbManager } from '../../utils/mongo-db-manager';
import { AuthManager } from '../../utils/auth-manager';
import { omitIds } from '../../utils/omit-ids';
import { OkResponse, UnauthorizedInvalidAccessTokenErrorResponse, UnknownErrorResponse } from '../../utils/response';
import { DbCollection } from '../../utils/collections';

export async function getFlights(req: Request, dbManager: MongoDbManager, authManager: AuthManager): Promise<Response> {
  try {
    const { db } = await dbManager.getMongoDb();
    const user = await authManager.authenticateUser(req, db);
    if (!user) return new UnauthorizedInvalidAccessTokenErrorResponse();

    const url = new URL(req.url);
    const isPlannedOnly = url.searchParams.get('plannedOnly') === 'true';

    const collection = db.collection<Flight>(DbCollection.FLIGHTS);
    const cursor = isPlannedOnly
      ? collection.find({ userId: user.id, isPlanned: true })
      : collection.find({ userId: user.id });
    const results = await cursor.toArray();

    return new OkResponse(omitIds(results));
  } catch (e) {
    return new UnknownErrorResponse(e);
  } finally {
    await dbManager.closeMongoClient();
  }
}
