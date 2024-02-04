import { MockCollection, MockDb, MockDbManager } from '../../test-utils/mock/db.mock';
import { MongoDbManager } from '../../utils/mongo-db-manager';
import { MockAuthManager } from '../../test-utils/mock/auth.mock';
import { ApiError, Cycling } from 'pk-common';
import { cyclingData } from '../../test-utils/test-data/cycling';
import { deleteChore } from './delete-chore';

describe('deleteChore', () => {
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

  it('should delete chore by id', async () => {
    collection.findOne.and.resolveTo(cyclingData);
    collection.findOneAndUpdate.and.resolveTo({ ...cyclingData, chores: [] });
    const request = new Request('http://localhost:8888', {
      method: 'DELETE',
    });
    const response = await deleteChore(request, 'c1', dbManager as unknown as MongoDbManager, authManager);
    expect(collection.findOne).toHaveBeenCalledWith({ userId: '123' });
    expect(collection.findOneAndUpdate).toHaveBeenCalled();
    expect(response.status).toBe(200);
    const result = (await response.json()) as Cycling;
    expect(result.chores?.length).toEqual(0);
  });

  it('should return not found if no cycling data', async () => {
    collection.findOne.and.resolveTo(null);
    const request = new Request('http://localhost:8888', {
      method: 'DELETE',
    });
    const response = await deleteChore(request, 'c1', dbManager as unknown as MongoDbManager, authManager);
    expect(collection.findOne).toHaveBeenCalledWith({ userId: '123' });
    expect(collection.findOneAndUpdate).not.toHaveBeenCalled();
    expect(response.status).toBe(404);
    const result = await response.json();
    expect(result.error).toEqual(ApiError.ITEM_NOT_FOUND);
  });

  it('should return not found if id is incorrect', async () => {
    collection.findOne.and.resolveTo(cyclingData);
    const request = new Request('http://localhost:8888', {
      method: 'DELETE',
    });
    const response = await deleteChore(request, 'c2', dbManager as unknown as MongoDbManager, authManager);
    expect(collection.findOne).toHaveBeenCalledWith({ userId: '123' });
    expect(collection.findOneAndUpdate).not.toHaveBeenCalled();
    expect(response.status).toBe(404);
    const result = await response.json();
    expect(result.error).toEqual(ApiError.ITEM_NOT_FOUND);
  });

  it('should return not found if no chores', async () => {
    collection.findOne.and.resolveTo({ ...cyclingData, chores: [] });
    const request = new Request('http://localhost:8888', {
      method: 'DELETE',
    });
    const response = await deleteChore(request, 'c1', dbManager as unknown as MongoDbManager, authManager);
    expect(collection.findOne).toHaveBeenCalledWith({ userId: '123' });
    expect(collection.findOneAndUpdate).not.toHaveBeenCalled();
    expect(response.status).toBe(404);
    const result = await response.json();
    expect(result.error).toEqual(ApiError.ITEM_NOT_FOUND);
  });

  ['GET', 'PUT', 'POST', 'PATCH'].forEach(method => {
    it(`should not allow ${method} requests`, async () => {
      const response = await deleteChore(
        { method } as Request,
        'c1',
        dbManager as unknown as MongoDbManager,
        authManager
      );
      expect(response.status).toEqual(405);
    });
  });
});
