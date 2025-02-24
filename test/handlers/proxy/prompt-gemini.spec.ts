import { beforeEach, describe, expect, it } from '@jest/globals';
import { ApiError } from '../../../common';
import { promptGemini } from '../../../src/handlers/proxy/prompt-gemini';
import { AuthManager } from '../../../src/utils/auth-manager';
import { MongoDbManager } from '../../../src/utils/mongo-db-manager';
import { MockAiManager } from '../../../test-utils/mock/ai.mock';
import { MockAuthManager } from '../../../test-utils/mock/auth.mock';
import { MockCollection, MockDb, MockDbManager } from '../../../test-utils/mock/db.mock';

describe('prompt-gemini', () => {
  let db: MockDb;
  let collection: MockCollection;
  let dbManager: MockDbManager;
  let authManager: MockAuthManager;
  let aiManager: MockAiManager;

  beforeEach(() => {
    db = new MockDb();
    collection = new MockCollection();
    dbManager = new MockDbManager(db, collection);
    authManager = new MockAuthManager();
    aiManager = new MockAiManager();
    db.collection.mockReturnValue(collection);
    authManager.authenticateUser.mockResolvedValue({ id: '123' });
    process.env.GEMINI_API_KEY = 'apikey';
  });

  it('should call gemini to generate text', async () => {
    aiManager.generate.mockResolvedValueOnce({ result: 'Hello' });
    const request = new Request('http://localhost:8888', {
      method: 'POST',
      body: JSON.stringify({ input: 'Hi' }),
    });
    const response = await promptGemini(
      request,
      dbManager as unknown as MongoDbManager,
      authManager as AuthManager,
      aiManager
    );
    expect(aiManager.generate).toHaveBeenCalledTimes(1);
    expect(response.status).toEqual(200);
    const data: any = await response.json();
    expect(data.result).toEqual('Hello');
  });

  it('should return server error if generate fails', async () => {
    aiManager.generate.mockImplementation(() => {
      throw new Error();
    });
    const request = new Request('http://localhost:8888', {
      method: 'POST',
      body: JSON.stringify({ input: 'Hi' }),
    });
    const response = await promptGemini(
      request,
      dbManager as unknown as MongoDbManager,
      authManager as AuthManager,
      aiManager
    );
    expect(response.status).toEqual(500);
    const data: any = await response.json();
    expect(data.error).toEqual(ApiError.UNKNOWN_ERROR);
  });

  ['GET', 'PUT', 'DELETE', 'PATCH'].forEach(method => {
    it(`should not allow ${method} requests`, async () => {
      const request = new Request('http://localhost:8888', {
        method,
        body: method !== 'GET' ? JSON.stringify({ input: 'Hi' }) : undefined,
      });
      const response = await promptGemini(
        request,
        dbManager as unknown as MongoDbManager,
        authManager as AuthManager,
        aiManager
      );
      expect(response.status).toEqual(405);
    });
  });
});
