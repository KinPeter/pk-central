import { Config, Context } from '@netlify/functions';
import { withMongoDb } from '../src/utils/mongo-hof.js';
import { CorsOkResponse, ErrorResponse } from '../src/utils/response.js';
import { withAuthentication } from '../src/utils/auth-hof.js';
import { getAllVisits } from '../src/handlers/visits.js';

export const config: Config = {
  path: ['/visits', '/visits/:operation'],
  method: ['GET', 'POST', 'PUT', 'OPTIONS'],
};

export default async (req: Request, context: Context) => {
  if (req.method === 'OPTIONS') return new CorsOkResponse();

  const { operation } = context.params;

  switch (operation) {
    case 'all':
      return await withMongoDb(await withAuthentication(getAllVisits), req, context);
    default:
      return new ErrorResponse(`Unknown operation: /visits/${operation}`, 400);
  }
};
