import { MockCollection, MockDb, MockDbManager } from '../../test-utils/mock/db.mock';
import { MongoDbManager } from '../../utils/mongo-db-manager';
import { MockAuthManager } from '../../test-utils/mock/auth.mock';
import { ApiError, Cycling } from 'pk-common';
import { cyclingData, invalidChoreRequests, validChoreRequest } from '../../test-utils/test-data/cycling';
import { addChore } from './add-chore';

describe('addChore', () => {
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

  it('should create new chore', async () => {
    collection.findOne.and.resolveTo(cyclingData);
    collection.findOneAndUpdate.and.resolveTo({
      ...cyclingData,
      chores: [...cyclingData.chores!, { ...validChoreRequest }],
    });
    const request = new Request('http://localhost:8888', {
      method: 'POST',
      body: JSON.stringify(validChoreRequest),
    });
    const response = await addChore(request, dbManager as unknown as MongoDbManager, authManager);
    expect(collection.findOne).toHaveBeenCalledWith({ userId: '123' });
    expect(collection.findOneAndUpdate).toHaveBeenCalled();
    expect(response.status).toBe(201);
    const result = (await response.json()) as Cycling;
    expect(result.chores?.length).toEqual(2);
  });

  it('should return not found if there is no cycling data', async () => {
    collection.findOne.and.resolveTo(null);
    const request = new Request('http://localhost:8888', {
      method: 'POST',
      body: JSON.stringify(validChoreRequest),
    });
    const response = await addChore(request, dbManager as unknown as MongoDbManager, authManager);
    expect(collection.findOne).toHaveBeenCalledWith({ userId: '123' });
    expect(collection.findOneAndUpdate).not.toHaveBeenCalled();
    expect(response.status).toBe(404);
    const result = await response.json();
    expect(result.error).toEqual(ApiError.ITEM_NOT_FOUND);
  });

  it('should return not found if update does not find cycling data', async () => {
    collection.findOne.and.resolveTo(cyclingData);
    collection.findOneAndUpdate.and.resolveTo(null);
    const request = new Request('http://localhost:8888', {
      method: 'POST',
      body: JSON.stringify(validChoreRequest),
    });
    const response = await addChore(request, dbManager as unknown as MongoDbManager, authManager);
    expect(collection.findOne).toHaveBeenCalledWith({ userId: '123' });
    expect(collection.findOneAndUpdate).toHaveBeenCalled();
    expect(response.status).toBe(404);
    const result = await response.json();
    expect(result.error).toEqual(ApiError.ITEM_NOT_FOUND);
  });

  ['GET', 'PUT', 'DELETE', 'PATCH'].forEach(method => {
    it(`should not allow ${method} requests`, async () => {
      const response = await addChore({ method } as Request, dbManager as unknown as MongoDbManager, authManager);
      expect(response.status).toEqual(405);
    });
  });

  invalidChoreRequests.forEach(body => {
    it(`should return validation error for invalid request body: ${JSON.stringify(body)}`, async () => {
      const request = new Request('http://localhost:8888', {
        method: 'POST',
        body: JSON.stringify(body),
      });
      const response = await addChore(request, dbManager as unknown as MongoDbManager, authManager);
      expect(response.status).toEqual(400);
      const data = await response.json();
      expect(data.error).toEqual(ApiError.REQUEST_VALIDATION_FAILED);
    });
  });
});
