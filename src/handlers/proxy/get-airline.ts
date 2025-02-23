import { MongoDbManager } from '../../utils/mongo-db-manager';
import {
  MethodNotAllowedResponse,
  NotFoundErrorResponse,
  OkResponse,
  UnauthorizedInvalidAccessTokenErrorResponse,
  UnknownErrorResponse,
  ValidationErrorResponse,
} from '../../utils/response';
import { Airline, ValidationError } from '../../../common';
import { getEnv } from '../../utils/environment';
import { AuthManager } from '../../utils/auth-manager';
import { FetchResponseType, HttpClient } from '../../utils/http-client';
import { AirlabsAirlineResponse } from '../../utils/third-parties';

export async function getAirline(
  req: Request,
  query: string,
  dbManager: MongoDbManager,
  authManager: AuthManager,
  httpClient: HttpClient
): Promise<Response> {
  try {
    if (req.method !== 'GET') return new MethodNotAllowedResponse(req.method);
    if (!query?.length) return new ValidationErrorResponse(ValidationError.INVALID_FORMAT);

    const { db } = await dbManager.getMongoDb();
    const user = await authManager.authenticateUser(req, db);
    if (!user) return new UnauthorizedInvalidAccessTokenErrorResponse();

    const [AIRLABS_API_KEY, PROXY_AIRLABS_AIRLINES_URL] = getEnv('AIRLABS_API_KEY', 'PROXY_AIRLABS_AIRLINES_URL');
    if (!AIRLABS_API_KEY) return new NotFoundErrorResponse('Airlabs API key');

    const airlabsUrl = `${PROXY_AIRLABS_AIRLINES_URL}?iata_code=${query}&api_key=${AIRLABS_API_KEY}`;
    const airlabsResponse = await httpClient.get<AirlabsAirlineResponse>(airlabsUrl, FetchResponseType.JSON);

    const { response } = airlabsResponse;
    const airlineData = response?.[0];
    if (!airlineData) return new NotFoundErrorResponse('Airline data');

    const result: Airline = {
      iata: query.toUpperCase(),
      icao: airlineData.icao_code,
      name: airlineData.name,
    };

    return new OkResponse<Airline>(result);
  } catch (e) {
    return new UnknownErrorResponse(e);
  } finally {
    await dbManager.closeMongoClient();
  }
}
