import { beforeEach, describe, expect, it } from '@jest/globals';
import { MockCollection, MockDb, MockDbManager } from '../../../test-utils/mock/db.mock';
import { MockAuthManager } from '../../../test-utils/mock/auth.mock';
import { MongoDbManager } from '../../../src/utils/mongo-db-manager';
import { AuthManager } from '../../../src/utils/auth-manager';
import { ApiError } from '../../../common';
import { MockHttpClient } from '../../../test-utils/mock/http-client.mock';
import { HttpClient } from '../../../src/utils/http-client';
import { airlabsAirlineData, airlineResponse } from '../../../test-utils/test-data/proxy';
import { getAirline } from '../../../src/handlers/proxy/get-airline';

describe('getAirline', () => {
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
  });

  it('should fetch and send airline data', async () => {
    collection.findOne.mockResolvedValue({ airlabsApiKey: 'al1' });
    httpClient.get.mockResolvedValueOnce(airlabsAirlineData);
    const response = await getAirline(
      { method: 'GET' } as Request,
      'tk',
      dbManager as unknown as MongoDbManager,
      authManager as AuthManager,
      httpClient as unknown as HttpClient
    );
    expect(db.collection).toHaveBeenCalledWith('shared-keys');
    expect(collection.findOne).toHaveBeenCalled();
    expect(httpClient.get).toHaveBeenCalledTimes(1);
    expect(response.status).toEqual(200);
    const data: any = await response.json();
    expect(data).toEqual(airlineResponse);
  });

  it('should return validation error if no query', async () => {
    collection.findOne.mockResolvedValue({ airlabsApiKey: 'al1' });
    const response = await getAirline(
      { method: 'GET' } as Request,
      '',
      dbManager as unknown as MongoDbManager,
      authManager as AuthManager,
      httpClient as unknown as HttpClient
    );
    expect(db.collection).not.toHaveBeenCalled();
    expect(httpClient.get).not.toHaveBeenCalled();
    expect(response.status).toEqual(400);
    const data: any = await response.json();
    expect(data.error).toEqual(ApiError.REQUEST_VALIDATION_FAILED);
  });

  it('should return not found error if no airlabs api key in db', async () => {
    collection.findOne.mockResolvedValue({ airlabsApiKey: null });
    const response = await getAirline(
      { method: 'GET' } as Request,
      'icn',
      dbManager as unknown as MongoDbManager,
      authManager as AuthManager,
      httpClient as unknown as HttpClient
    );
    expect(db.collection).toHaveBeenCalledWith('shared-keys');
    expect(httpClient.get).not.toHaveBeenCalled();
    expect(response.status).toEqual(404);
    const data: any = await response.json();
    expect(data.error).toEqual(ApiError.ITEM_NOT_FOUND);
  });

  it('should return server error if httpClient.get fails', async () => {
    collection.findOne.mockResolvedValue({ airlabsApiKey: 'al1' });
    httpClient.get.mockImplementation(() => {
      throw new Error();
    });
    const response = await getAirline(
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
      const response = await getAirline(
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
