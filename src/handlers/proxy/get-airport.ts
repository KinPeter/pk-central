import { MongoDbManager } from '../../utils/mongo-db-manager';
import {
  MethodNotAllowedResponse,
  NotFoundErrorResponse,
  OkResponse,
  UnauthorizedInvalidAccessTokenErrorResponse,
  UnknownErrorResponse,
  ValidationErrorResponse,
} from '../../utils/response';
import { Airport, ValidationError } from '../../../common';
import { AuthManager } from '../../utils/auth-manager';
import { FetchResponseType, HttpClient } from '../../utils/http-client';
import { AirlabsAirportResponse, LocationIqReverseResponse, SharedKeys } from '../../utils/third-parties';
import { DbCollection } from '../../utils/collections';

export async function getAirport(
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
    const locationApiKey = keys?.locationIqApiKey;
    if (!airlabsApiKey) return new NotFoundErrorResponse('Airlabs API key');
    if (!locationApiKey) return new NotFoundErrorResponse('Location IQ API key');

    const airlabsUrl = `${process.env.PROXY_AIRLABS_AIRPORTS_URL}?iata_code=${query}&api_key=${airlabsApiKey}`;
    const airlabsResponse = await httpClient.get<AirlabsAirportResponse>(airlabsUrl, FetchResponseType.JSON);
    const { response } = airlabsResponse;
    const airportData = response?.[0];
    if (!airportData) return new NotFoundErrorResponse('Airport data');

    const locationUrl = `${process.env.PROXY_LOCATION_REVERSE_URL}?key=${locationApiKey}&lat=${airportData.lat}&lon=${airportData.lng}&format=json`;
    const locationResponse = await httpClient.get<LocationIqReverseResponse>(locationUrl, FetchResponseType.JSON);
    if (!locationResponse?.address) return new NotFoundErrorResponse('Location data');

    const countryNames = new Intl.DisplayNames(['en'], { type: 'region' });

    const result: Airport = {
      city: locationResponse?.address?.city ?? '',
      country: countryNames.of(airportData.country_code.toUpperCase()) ?? '',
      iata: query.toUpperCase(),
      icao: airportData.icao_code,
      lat: airportData.lat,
      lng: airportData.lng,
      name: airportData.name,
    };

    return new OkResponse<Airport>(result);
  } catch (e) {
    return new UnknownErrorResponse(e);
  } finally {
    await dbManager.closeMongoClient();
  }
}
