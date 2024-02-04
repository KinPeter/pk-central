import { MockCollection, MockDb, MockDbManager } from '../../test-utils/mock/db.mock';
import { MongoDbManager } from '../../utils/mongo-db-manager';
import { MockAuthManager } from '../../test-utils/mock/auth.mock';
import { ApiError, Cycling } from 'pk-common';
import { cyclingData } from '../../test-utils/test-data/cycling';
import { createInitialData } from './create-initial-data';

describe('createInitialData', () => {
  let db: MockDb;
  let collection: MockCollection;
  let dbManager: MockDbManager;
  let authManager: MockAuthManager;

  beforeEach(() => {
    db = new MockDb();
    collection = new MockCollection();
    dbManager = new MockDbManager(db, collection);
    authManager = new MockAuthManager();
    db.collection.and.returnValue(collection);
    authManager.authenticateUser.and.resolveTo({ id: '123' });
  });

  it('should create initial cycling data', async () => {
    collection.findOne.and.resolveTo(null);
    collection.insertOne.and.resolveTo(true);
    const request = new Request('http://localhost:8888', {
      method: 'POST',
      body: undefined,
    });
    const response = await createInitialData(request, dbManager as unknown as MongoDbManager, authManager);
    expect(collection.findOne).toHaveBeenCalledWith({ userId: '123' });
    expect(collection.insertOne).toHaveBeenCalled();
    expect(response.status).toBe(201);
    const result = (await response.json()) as Cycling;
    expect(typeof result.id).toEqual('string');
  });

  it('should return already exists error if there is existing cycling data', async () => {
    collection.findOne.and.resolveTo(cyclingData);
    const request = new Request('http://localhost:8888', {
      method: 'POST',
      body: undefined,
    });
    const response = await createInitialData(request, dbManager as unknown as MongoDbManager, authManager);
    expect(collection.findOne).toHaveBeenCalledWith({ userId: '123' });
    expect(collection.insertOne).not.toHaveBeenCalled();
    expect(response.status).toBe(400);
    const result = await response.json();
    expect(result.error).toEqual(ApiError.DATA_ALREADY_EXISTS);
  });

  ['GET', 'PUT', 'DELETE', 'PATCH'].forEach(method => {
    it(`should not allow ${method} requests`, async () => {
      const response = await createInitialData(
        { method } as Request,
        dbManager as unknown as MongoDbManager,
        authManager
      );
      expect(response.status).toEqual(405);
    });
  });
});
