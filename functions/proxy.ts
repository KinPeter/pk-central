import { Config, Context } from '@netlify/functions';
import { CorsOkResponse, UnknownOperationErrorResponse } from '../src/utils/response';
import { MongoDbManager } from '../src/utils/mongo-db-manager';
import { AuthManager } from '../src/utils/auth-manager';
import { getBirthdays } from '../src/handlers/proxy/get-birthdays';
import { getKorean } from '../src/handlers/proxy/get-korean';
import { HttpClient } from '../src/utils/http-client';
import { getAirport } from '../src/handlers/proxy/get-airport';
import { getAirline } from '../src/handlers/proxy/get-airline';
import { getCity } from '../src/handlers/proxy/get-city';

export const config: Config = {
  path: ['/proxy/:operation', '/proxy/:operation/:query'],
  method: ['GET', 'OPTIONS'],
};

export default async (req: Request, context: Context) => {
  if (req.method === 'OPTIONS') return new CorsOkResponse();

  const { operation, query } = context.params;
  const dbManager = new MongoDbManager();
  const authManager = new AuthManager();
  const httpClient = new HttpClient(fetch);

  switch (operation) {
    case 'birthdays':
      return await getBirthdays(req, dbManager, authManager, httpClient);
    case 'korean':
      return await getKorean(req, dbManager, authManager, httpClient);
    case 'airport':
      return await getAirport(req, query, dbManager, authManager, httpClient);
    case 'airline':
      return await getAirline(req, query, dbManager, authManager, httpClient);
    case 'city':
      return await getCity(req, query, dbManager, authManager, httpClient);
    default:
      return new UnknownOperationErrorResponse(`/proxy/${operation}`);
  }
};
