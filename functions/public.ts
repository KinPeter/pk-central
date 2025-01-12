import { Config, Context } from '../server/types';
import { CorsOkResponse, UnknownOperationErrorResponse } from '../src/utils/response';
import { MongoDbManager } from '../src/utils/mongo-db-manager';
import { getAllTrips } from '../src/handlers/public/get-all-trips';

export const config: Config = {
  path: ['/public/:operation', '/public/:operation/:id'],
  method: ['GET', 'OPTIONS'],
};

export default async (req: Request, context: Context) => {
  if (req.method === 'OPTIONS') return new CorsOkResponse();

  const { operation, id } = context.params;
  const dbManager = new MongoDbManager();

  switch (operation) {
    case 'trips':
      return await getAllTrips(req, id, dbManager);
    default:
      return new UnknownOperationErrorResponse(`/public/${operation}`);
  }
};
