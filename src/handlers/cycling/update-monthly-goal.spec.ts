import { MockCollection, MockDb, MockDbManager } from '../../test-utils/mock/db.mock';
import { MongoDbManager } from '../../utils/mongo-db-manager';
import { MockAuthManager } from '../../test-utils/mock/auth.mock';
import { ApiError } from 'pk-common';
import { cyclingData, invalidMonthlyGoalRequests } from '../../test-utils/test-data/cycling';
import { updateMonthlyGoal } from './update-monthly-goal';

describe('updateMonthlyGoal', () => {
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

  it('should update monthly goal', async () => {
    collection.findOneAndUpdate.and.resolveTo(cyclingData);
    const request = new Request('http://localhost:8888', {
      method: 'PATCH',
      body: JSON.stringify({ monthlyGoal: 123 }),
    });
    const response = await updateMonthlyGoal(request, dbManager as unknown as MongoDbManager, authManager);
    expect(collection.findOneAndUpdate).toHaveBeenCalled();
    expect(collection.findOneAndUpdate.calls.mostRecent().args[0]).toEqual({ userId: '123' });
    expect(response.status).toBe(200);
  });

  it('should return not found if no cycling data', async () => {
    collection.findOneAndUpdate.and.resolveTo(null);
    const request = new Request('http://localhost:8888', {
      method: 'PATCH',
      body: JSON.stringify({ monthlyGoal: 123 }),
    });
    const response = await updateMonthlyGoal(request, dbManager as unknown as MongoDbManager, authManager);
    expect(collection.findOneAndUpdate).toHaveBeenCalled();
    expect(collection.findOneAndUpdate.calls.mostRecent().args[0]).toEqual({ userId: '123' });
    expect(response.status).toBe(404);
    const result = await response.json();
    expect(result.error).toEqual(ApiError.ITEM_NOT_FOUND);
  });

  ['GET', 'DELETE', 'POST', 'PUT'].forEach(method => {
    it(`should not allow ${method} requests`, async () => {
      const response = await updateMonthlyGoal(
        { method } as Request,
        dbManager as unknown as MongoDbManager,
        authManager
      );
      expect(response.status).toEqual(405);
    });
  });

  invalidMonthlyGoalRequests.forEach(body => {
    it(`should return validation error for invalid request body: ${JSON.stringify(body)}`, async () => {
      const request = new Request('http://localhost:8888', {
        method: 'PATCH',
        body: JSON.stringify(body),
      });
      const response = await updateMonthlyGoal(request, dbManager as unknown as MongoDbManager, authManager);
      expect(response.status).toEqual(400);
      const data = await response.json();
      expect(data.error).toEqual(ApiError.REQUEST_VALIDATION_FAILED);
    });
  });
});
