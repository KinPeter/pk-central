import { beforeEach, describe, expect, it } from '@jest/globals';
import { MockCollection, MockDb, MockDbManager } from '../../../test-utils/mock/db.mock';
import { MongoDbManager } from '../../../src/utils/mongo-db-manager';
import { MockAuthManager } from '../../../test-utils/mock/auth.mock';
import { ApiError } from '../../../common';
import { setPassword } from '../../../src/handlers/auth/set-password';

describe('setPassword', () => {
  let db: MockDb;
  let collection: MockCollection;
  let dbManager: MockDbManager;
  let authManager: MockAuthManager;

  beforeEach(() => {
    db = new MockDb();
    collection = new MockCollection();
    dbManager = new MockDbManager(db, collection);
    authManager = new MockAuthManager();
    db.collection.mockReturnValue(collection);
    authManager.authenticateUser.mockResolvedValue({ id: '123', email: 'test@test.com' });
  });

  it('should update the password', async () => {
    const request = new Request('http://localhost:8888', {
      method: 'PUT',
      body: JSON.stringify({ email: 'test@test.com', password: 'password' }),
    });
    const response = await setPassword(request, dbManager as unknown as MongoDbManager, authManager);
    expect(db.collection).toHaveBeenCalledWith('users');
    expect(collection.updateOne).toHaveBeenCalled();
    expect(response.status).toBe(201);
    const result: any = await response.json();
    expect(result.id).toEqual('123');
  });

  it('should return unauthorized error if emails do not match', async () => {
    const request = new Request('http://localhost:8888', {
      method: 'PUT',
      body: JSON.stringify({ email: 'test22@test.com', password: 'password' }),
    });
    const response = await setPassword(request, dbManager as unknown as MongoDbManager, authManager);
    expect(collection.updateOne).not.toHaveBeenCalled();
    expect(response.status).toBe(401);
  });

  ['GET', 'POST', 'DELETE', 'PATCH'].forEach(method => {
    it(`should not allow ${method} requests`, async () => {
      const response = await setPassword({ method } as Request, dbManager as unknown as MongoDbManager, authManager);
      expect(response.status).toEqual(405);
    });
  });

  [
    { email: 'test@test.com' },
    { email: 'not-an-email', password: 'password' },
    { email: 'test@test.com', password: 123456 },
    { password: 'password' },
    { email: 'test@email.com', password: '123' },
  ].forEach(body => {
    it(`should return validation error for invalid request body: ${JSON.stringify(body)}`, async () => {
      const request = new Request('http://localhost:8888', {
        method: 'PUT',
        body: JSON.stringify(body),
      });
      const response = await setPassword(request, dbManager as unknown as MongoDbManager, authManager);
      expect(response.status).toEqual(400);
      const data: any = await response.json();
      expect(data.error).toContain(ApiError.REQUEST_VALIDATION_FAILED);
    });
  });
});
