import { beforeEach, describe, expect, it } from '@jest/globals';
import { ApiError } from '../../../common';
import { translate } from '../../../src/handlers/proxy/translate';
import { AuthManager } from '../../../src/utils/auth-manager';
import { HttpClient } from '../../../src/utils/http-client';
import { MongoDbManager } from '../../../src/utils/mongo-db-manager';
import { MockAuthManager } from '../../../test-utils/mock/auth.mock';
import { MockCollection, MockDb, MockDbManager } from '../../../test-utils/mock/db.mock';
import { MockHttpClient } from '../../../test-utils/mock/http-client.mock';
import {
  deeplTranslationResponse,
  invalidTranslationRequests,
  translationResponse,
  validTranslationRequest,
} from '../../../test-utils/test-data/proxy';

describe('translate', () => {
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
    process.env.PROXY_DEEPL_TRANSLATE_URL = 'https://deepl.com';
    process.env.DEEPL_API_KEY = '';
  });

  it('should call deepl api to translate text', async () => {
    process.env.DEEPL_API_KEY = 'deepl1';
    httpClient.post.mockResolvedValueOnce(deeplTranslationResponse);
    const request = new Request('http://localhost:8888', {
      method: 'POST',
      body: JSON.stringify(validTranslationRequest),
    });
    const response = await translate(
      request,
      dbManager as unknown as MongoDbManager,
      authManager as AuthManager,
      httpClient as unknown as HttpClient
    );
    expect(httpClient.post).toHaveBeenCalledTimes(1);
    expect(response.status).toEqual(200);
    const data: any = await response.json();
    expect(data).toEqual(translationResponse);
  });

  it('should return server error if http.post fails', async () => {
    process.env.DEEPL_API_KEY = 'deepl1';
    httpClient.post.mockImplementation(() => {
      throw new Error();
    });
    const request = new Request('http://localhost:8888', {
      method: 'POST',
      body: JSON.stringify(validTranslationRequest),
    });
    const response = await translate(
      request,
      dbManager as unknown as MongoDbManager,
      authManager as AuthManager,
      httpClient as unknown as HttpClient
    );
    expect(response.status).toEqual(500);
    const data: any = await response.json();
    expect(data.error).toEqual(ApiError.UNKNOWN_ERROR);
  });

  invalidTranslationRequests.forEach(body => {
    it(`should return validation error for invalid request body: ${JSON.stringify(body)}`, async () => {
      const request = new Request('http://localhost:8888', {
        method: 'POST',
        body: JSON.stringify(body),
      });
      const response = await translate(
        request,
        dbManager as unknown as MongoDbManager,
        authManager,
        httpClient as unknown as HttpClient
      );
      expect(response.status).toEqual(400);
      const data: any = await response.json();
      expect(data.error).toEqual(ApiError.REQUEST_VALIDATION_FAILED);
    });
  });

  ['GET', 'PUT', 'DELETE', 'PATCH'].forEach(method => {
    it(`should not allow ${method} requests`, async () => {
      const request = new Request('http://localhost:8888', {
        method,
        body: method !== 'GET' ? JSON.stringify(validTranslationRequest) : undefined,
      });
      const response = await translate(
        request,
        dbManager as unknown as MongoDbManager,
        authManager as AuthManager,
        httpClient as unknown as HttpClient
      );
      expect(response.status).toEqual(405);
    });
  });
});
