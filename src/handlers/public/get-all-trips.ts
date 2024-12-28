import { UUID, ValidationError } from 'pk-common';
import { MongoDbManager } from '../../utils/mongo-db-manager';
import * as yup from 'yup';
import { ErrorResponse, MethodNotAllowedResponse, OkResponse, UnknownErrorResponse } from '../../utils/response';
import { omitIds } from '../../utils/omit-ids';
import { DbCollection } from '../../utils/collections';

export async function getAllTrips(req: Request, userId: UUID, dbManager: MongoDbManager): Promise<Response> {
  try {
    if (req.method !== 'GET') return new MethodNotAllowedResponse(req.method);

    if (!userId || !yup.string().uuid().isValidSync(userId))
      return new ErrorResponse(ValidationError.INVALID_UUID, 400);

    const { db } = await dbManager.getMongoDb();

    const flightsCollection = db.collection(DbCollection.FLIGHTS);
    const flightsCursor = flightsCollection.find({ userId });
    const flights = await flightsCursor.toArray();

    const visitsCollection = db.collection(DbCollection.VISITS);
    const visitsCursor = visitsCollection.find({ userId });
    const visits = await visitsCursor.toArray();

    return new OkResponse({
      flights: omitIds(flights),
      visits: omitIds(visits),
    });
  } catch (e) {
    return new UnknownErrorResponse(e);
  } finally {
    await dbManager.closeMongoClient();
  }
}
