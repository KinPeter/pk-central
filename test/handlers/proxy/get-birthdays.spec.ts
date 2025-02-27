import { beforeEach, describe, expect, it } from '@jest/globals';
import { MockCollection, MockDb, MockDbManager } from '../../../test-utils/mock/db.mock';
import { MockAuthManager } from '../../../test-utils/mock/auth.mock';
import { MongoDbManager } from '../../../src/utils/mongo-db-manager';
import { AuthManager } from '../../../src/utils/auth-manager';
import { ApiError } from '../../../common';
import { MockHttpClient } from '../../../test-utils/mock/http-client.mock';
import { getBirthdays } from '../../../src/handlers/proxy/get-birthdays';
import { FetchResponseType, HttpClient } from '../../../src/utils/http-client';
import { birthdaysResponse, birthdaysTsv } from '../../../test-utils/test-data/proxy';

describe('getBirthdays', () => {
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

  it('should fetch and serialize birthdays', async () => {
    collection.findOne.mockResolvedValue({ birthdaysUrl: 'url' });
    httpClient.get.mockResolvedValue(birthdaysTsv);
    const response = await getBirthdays(
      { method: 'GET' } as Request,
      dbManager as unknown as MongoDbManager,
      authManager as AuthManager,
      httpClient as unknown as HttpClient
    );
    expect(db.collection).toHaveBeenCalledWith('start-settings');
    expect(collection.findOne).toHaveBeenCalledWith({ userId: '123' });
    expect(httpClient.get).toHaveBeenCalledWith('url', FetchResponseType.TEXT);
    expect(response.status).toEqual(200);
    const data: any = await response.json();
    expect(Array.isArray(data)).toBeTruthy();
    expect(data.length).toEqual(2);
    expect(data).toEqual(birthdaysResponse);
  });

  it('should return not found error if no url in settings', async () => {
    collection.findOne.mockResolvedValue({ birthdaysUrl: null });
    const response = await getBirthdays(
      { method: 'GET' } as Request,
      dbManager as unknown as MongoDbManager,
      authManager as AuthManager,
      httpClient as unknown as HttpClient
    );
    expect(db.collection).toHaveBeenCalledWith('start-settings');
    expect(collection.findOne).toHaveBeenCalledWith({ userId: '123' });
    expect(httpClient.get).not.toHaveBeenCalled();
    expect(response.status).toEqual(404);
    const data: any = await response.json();
    expect(data.error).toEqual(ApiError.ITEM_NOT_FOUND);
  });

  it('should return server error if httpClient.get fails', async () => {
    collection.findOne.mockResolvedValue({ birthdaysUrl: 'url' });
    httpClient.get.mockImplementation(() => {
      throw new Error();
    });
    const response = await getBirthdays(
      { method: 'GET' } as Request,
      dbManager as unknown as MongoDbManager,
      authManager as AuthManager,
      httpClient as unknown as HttpClient
    );
    expect(db.collection).toHaveBeenCalledWith('start-settings');
    expect(collection.findOne).toHaveBeenCalledWith({ userId: '123' });
    expect(httpClient.get).toHaveBeenCalledWith('url', FetchResponseType.TEXT);
    expect(response.status).toEqual(500);
    const data: any = await response.json();
    expect(data.error).toEqual(ApiError.UNKNOWN_ERROR);
  });

  ['POST', 'PUT', 'DELETE', 'PATCH'].forEach(method => {
    it(`should not allow ${method} requests`, async () => {
      const response = await getBirthdays(
        { method } as Request,
        dbManager as unknown as MongoDbManager,
        authManager as AuthManager,
        httpClient as unknown as HttpClient
      );
      expect(response.status).toEqual(405);
    });
  });
});
