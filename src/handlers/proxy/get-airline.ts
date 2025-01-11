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
import { AuthManager } from '../../utils/auth-manager';
import { FetchResponseType, HttpClient } from '../../utils/http-client';
import { AirlabsAirlineResponse, SharedKeys } from '../../utils/third-parties';
import { DbCollection } from '../../utils/collections';

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

    const sharedKeysCollection = db.collection<SharedKeys>(DbCollection.SHARED_KEYS);
    const keys = await sharedKeysCollection.findOne();
    const airlabsApiKey = keys?.airlabsApiKey;
    if (!airlabsApiKey) return new NotFoundErrorResponse('Airlabs API key');

    const airlabsUrl = `https://airlabs.co/api/v9/airlines?iata_code=${query}&api_key=${airlabsApiKey}`;
    const airlabsResponse = await httpClient.get<AirlabsAirlineResponse>(airlabsUrl, FetchResponseType.JSON);
    console.log(airlabsResponse);
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
