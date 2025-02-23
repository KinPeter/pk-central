import { MongoDbManager } from '../../utils/mongo-db-manager';
import {
  MethodNotAllowedResponse,
  NotFoundErrorResponse,
  OkResponse,
  UnauthorizedInvalidAccessTokenErrorResponse,
  UnknownErrorResponse,
  ValidationErrorResponse,
} from '../../utils/response';
import { COORDINATES_QUERY_REGEX, ValidationError, type VisitRequest } from '../../../common';
import { getEnv } from '../../utils/environment';
import { AuthManager } from '../../utils/auth-manager';
import { FetchResponseType, HttpClient } from '../../utils/http-client';
import { LocationIqReverseResponse } from '../../utils/third-parties';

export async function getCity(
  req: Request,
  query: string,
  dbManager: MongoDbManager,
  authManager: AuthManager,
  httpClient: HttpClient
): Promise<Response> {
  try {
    if (req.method !== 'GET') return new MethodNotAllowedResponse(req.method);
    if (!query?.length) return new ValidationErrorResponse(ValidationError.INVALID_FORMAT);

    const match = query.match(COORDINATES_QUERY_REGEX);
    if (!match) return new ValidationErrorResponse(ValidationError.INVALID_FORMAT);
    const lat = Number(match[1]);
    const lng = Number(match[2]);

    const { db } = await dbManager.getMongoDb();
    const user = await authManager.authenticateUser(req, db);
    if (!user) return new UnauthorizedInvalidAccessTokenErrorResponse();

    const [LOCATION_IQ_API_KEY, PROXY_LOCATION_REVERSE_URL] = getEnv(
      'LOCATION_IQ_API_KEY',
      'PROXY_LOCATION_REVERSE_URL'
    );
    if (!LOCATION_IQ_API_KEY) return new NotFoundErrorResponse('Location IQ API key');

    const locationUrl = `${PROXY_LOCATION_REVERSE_URL}?key=${LOCATION_IQ_API_KEY}&lat=${lat}&lon=${lng}&format=json`;
    const locationResponse = await httpClient.get<LocationIqReverseResponse>(locationUrl, FetchResponseType.JSON);
    if (!locationResponse?.address) return new NotFoundErrorResponse('Location data');

    const countryNames = new Intl.DisplayNames(['en'], { type: 'region' });

    const result: VisitRequest = {
      city: locationResponse?.address?.city ?? '',
      country: countryNames.of(locationResponse?.address?.country_code?.toUpperCase() ?? '') ?? '',
      lat,
      lng,
    };

    return new OkResponse<VisitRequest>(result);
  } catch (e) {
    return new UnknownErrorResponse(e);
  } finally {
    await dbManager.closeMongoClient();
  }
}
