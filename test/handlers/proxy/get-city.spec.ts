import { beforeEach, describe, expect, it } from '@jest/globals';
import { MockCollection, MockDb, MockDbManager } from '../../../test-utils/mock/db.mock';
import { MockAuthManager } from '../../../test-utils/mock/auth.mock';
import { MongoDbManager } from '../../../src/utils/mongo-db-manager';
import { AuthManager } from '../../../src/utils/auth-manager';
import { ApiError } from '../../../common';
import { MockHttpClient } from '../../../test-utils/mock/http-client.mock';
import { HttpClient } from '../../../src/utils/http-client';
import { cityResponse, locationIqLocationData } from '../../../test-utils/test-data/proxy';
import { getCity } from '../../../src/handlers/proxy/get-city';

describe('getCity', () => {
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
    process.env.PROXY_LOCATION_REVERSE_URL = 'https://locationiq.com';
    process.env.LOCATION_IQ_API_KEY = '';
  });

  it('should fetch and send location data', async () => {
    process.env.LOCATION_IQ_API_KEY = 'apikey';
    httpClient.get.mockResolvedValueOnce(locationIqLocationData);
    const response = await getCity(
      { method: 'GET' } as Request,
      '23.222,10',
      dbManager as unknown as MongoDbManager,
      authManager as AuthManager,
      httpClient as unknown as HttpClient
    );
    expect(httpClient.get).toHaveBeenCalledTimes(1);
    expect(response.status).toEqual(200);
    const data: any = await response.json();
    expect(data).toEqual(cityResponse);
  });

  it('should return validation error if no query', async () => {
    const response = await getCity(
      { method: 'GET' } as Request,
      '',
      dbManager as unknown as MongoDbManager,
      authManager as AuthManager,
      httpClient as unknown as HttpClient
    );
    expect(response.status).toEqual(400);
    const data: any = await response.json();
    expect(data.error).toEqual(ApiError.REQUEST_VALIDATION_FAILED);
  });

  it('should return validation error if invalid query', async () => {
    const response = await getCity(
      { method: 'GET' } as Request,
      'not-coords',
      dbManager as unknown as MongoDbManager,
      authManager as AuthManager,
      httpClient as unknown as HttpClient
    );
    expect(response.status).toEqual(400);
    const data: any = await response.json();
    expect(data.error).toEqual(ApiError.REQUEST_VALIDATION_FAILED);
  });

  it('should return not found error if no location iq api key in env', async () => {
    const response = await getCity(
      { method: 'GET' } as Request,
      '23.222,10',
      dbManager as unknown as MongoDbManager,
      authManager as AuthManager,
      httpClient as unknown as HttpClient
    );
    expect(httpClient.get).not.toHaveBeenCalled();
    expect(response.status).toEqual(404);
    const data: any = await response.json();
    expect(data.error).toEqual(ApiError.ITEM_NOT_FOUND);
  });

  it('should return server error if httpClient.get fails', async () => {
    process.env.LOCATION_IQ_API_KEY = 'apikey';
    httpClient.get.mockImplementation(() => {
      throw new Error();
    });
    const response = await getCity(
      { method: 'GET' } as Request,
      '23.222,10',
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
      const response = await getCity(
        { method } as Request,
        '23.222,10',
        dbManager as unknown as MongoDbManager,
        authManager as AuthManager,
        httpClient as unknown as HttpClient
      );
      expect(response.status).toEqual(405);
    });
  });
});
