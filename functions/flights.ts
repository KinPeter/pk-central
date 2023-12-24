import { Config, Context } from '@netlify/functions';
import { withMongoDb } from '../src/utils/mongo-hof.js';
import { CorsOkResponse, ErrorResponse } from '../src/utils/response.js';
import { withAuthentication } from '../src/utils/auth-hof.js';
import { getAllFlights } from '../src/handlers/flights.js';

export const config: Config = {
  path: ['/flights', '/flights/:operation'],
  method: ['GET', 'POST', 'PUT', 'OPTIONS'],
};

export default async (req: Request, context: Context) => {
  if (req.method === 'OPTIONS') return new CorsOkResponse();

  const { operation } = context.params;

  switch (operation) {
    case 'all':
      return await withMongoDb(await withAuthentication(getAllFlights), req, context);
    default:
      return new ErrorResponse(`Unknown operation: /flights/${operation}`, 400);
  }
};
