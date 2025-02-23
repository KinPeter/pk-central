import { beforeEach, describe, expect, it } from '@jest/globals';
import { MockCollection, MockDb, MockDbManager } from '../../../test-utils/mock/db.mock';
import { MockAuthManager } from '../../../test-utils/mock/auth.mock';
import { MongoDbManager } from '../../../src/utils/mongo-db-manager';
import { AuthManager } from '../../../src/utils/auth-manager';
import { ApiError } from '../../../common';
import { MockHttpClient } from '../../../test-utils/mock/http-client.mock';
import { HttpClient } from '../../../src/utils/http-client';
import { airlabsAirportData, airportResponse, locationIqLocationData } from '../../../test-utils/test-data/proxy';
import { getAirport } from '../../../src/handlers/proxy/get-airport';

describe('getAirport', () => {
  let db: MockDb;
  let collection: MockCollection;
  let dbManager: MockDbManager;
  let authManager: MockAuthManager;
  let httpClient: MockHttpClient;

  beforeEach(() => {
    db = new MockDb();
    collection = new MockCollection();
    dbManager = new MockDbManager(db, collection);
    authManager = new MockAuthManager();
    httpClient = new MockHttpClient();
    db.collection.mockReturnValue(collection);
    authManager.authenticateUser.mockResolvedValue({ id: '123' });
    process.env.PROXY_AIRLABS_AIRPORTS_URL = 'https://airlabs.com';
    process.env.PROXY_LOCATION_REVERSE_URL = 'https://locationiq.com';
    process.env.AIRLABS_API_KEY = '';
    process.env.LOCATION_IQ_API_KEY = '';
  });

  it('should fetch and send airport data', async () => {
    process.env.AIRLABS_API_KEY = 'apikey';
    process.env.LOCATION_IQ_API_KEY = 'apikey';
    httpClient.get.mockResolvedValueOnce(airlabsAirportData);
    httpClient.get.mockResolvedValueOnce(locationIqLocationData);
    const response = await getAirport(
      { method: 'GET' } as Request,
      'icn',
      dbManager as unknown as MongoDbManager,
      authManager as AuthManager,
      httpClient as unknown as HttpClient
    );
    expect(httpClient.get).toHaveBeenCalledTimes(2);
    expect(response.status).toEqual(200);
    const data: any = await response.json();
    expect(data).toEqual(airportResponse);
  });

  it('should return validation error if no query', async () => {
    const response = await getAirport(
      { method: 'GET' } as Request,
      '',
      dbManager as unknown as MongoDbManager,
      authManager as AuthManager,
      httpClient as unknown as HttpClient
    );
    expect(httpClient.get).not.toHaveBeenCalled();
    expect(response.status).toEqual(400);
    const data: any = await response.json();
    expect(data.error).toEqual(ApiError.REQUEST_VALIDATION_FAILED);
  });

  it('should return not found error if no airlabs api key in env', async () => {
    process.env.LOCATION_IQ_API_KEY = 'apikey';
    const response = await getAirport(
      { method: 'GET' } as Request,
      'icn',
      dbManager as unknown as MongoDbManager,
      authManager as AuthManager,
      httpClient as unknown as HttpClient
    );
    expect(httpClient.get).not.toHaveBeenCalled();
    expect(response.status).toEqual(404);
    const data: any = await response.json();
    expect(data.error).toEqual(ApiError.ITEM_NOT_FOUND);
  });

  it('should return not found error if no location iq api key in env', async () => {
    process.env.AIRLABS_API_KEY = 'apikey';
    const response = await getAirport(
      { method: 'GET' } as Request,
      'icn',
      dbManager as unknown as MongoDbManager,
      authManager as AuthManager,
      httpClient as unknown as HttpClient
    );
    expect(response.status).toEqual(404);
    const data: any = await response.json();
    expect(data.error).toEqual(ApiError.ITEM_NOT_FOUND);
  });

  it('should return server error if httpClient.get fails', async () => {
    process.env.AIRLABS_API_KEY = 'apikey';
    process.env.LOCATION_IQ_API_KEY = 'apikey';
    httpClient.get.mockImplementation(() => {
      throw new Error();
    });
    const response = await getAirport(
      { method: 'GET' } as Request,
      'icn',
      dbManager as unknown as MongoDbManager,
      authManager as AuthManager,
      httpClient as unknown as HttpClient
    );
    expect(response.status).toEqual(500);
    const data: any = await response.json();
    expect(data.error).toEqual(ApiError.UNKNOWN_ERROR);
  });

  ['POST', 'PUT', 'DELETE', 'PATCH'].forEach(method => {
    it(`should not allow ${method} requests`, async () => {
      const response = await getAirport(
        { method } as Request,
        'icn',
        dbManager as unknown as MongoDbManager,
        authManager as AuthManager,
        httpClient as unknown as HttpClient
      );
      expect(response.status).toEqual(405);
    });
  });
});
