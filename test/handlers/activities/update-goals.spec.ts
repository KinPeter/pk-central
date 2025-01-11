import { describe, beforeEach, it, expect } from '@jest/globals';
import { MockCollection, MockDb, MockDbManager } from '../../../test-utils/mock/db.mock';
import { MongoDbManager } from '../../../src/utils/mongo-db-manager';
import { MockAuthManager } from '../../../test-utils/mock/auth.mock';
import { ApiError } from '../../../common';
import { activitiesData, invalidGoalsRequests, validGoalsRequests } from '../../../test-utils/test-data/activities';
import { updateGoals } from '../../../src/handlers/activities/update-goals';

describe('updateGoals', () => {
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
    authManager.authenticateUser.mockResolvedValue({ id: '123' });
  });

  it.each(validGoalsRequests)('should update goals', async requestBody => {
    collection.findOneAndUpdate.mockResolvedValue(activitiesData);
    const request = new Request('http://localhost:8888', {
      method: 'PATCH',
      body: JSON.stringify(requestBody),
    });
    const response = await updateGoals(request, dbManager as unknown as MongoDbManager, authManager);
    expect(db.collection).toHaveBeenCalledWith('activities');
    expect(collection.findOneAndUpdate).toHaveBeenCalled();
    expect(collection.findOneAndUpdate.mock.calls.slice(-1)[0]).toContainEqual({ userId: '123' });
    expect(response.status).toBe(200);
  });

  it('should return not found if no activities data', async () => {
    collection.findOneAndUpdate.mockResolvedValue(null);
    const request = new Request('http://localhost:8888', {
      method: 'PATCH',
      body: JSON.stringify(validGoalsRequests[0]),
    });
    const response = await updateGoals(request, dbManager as unknown as MongoDbManager, authManager);
    expect(collection.findOneAndUpdate).toHaveBeenCalled();
    expect(collection.findOneAndUpdate.mock.calls.slice(-1)[0]).toContainEqual({ userId: '123' });
    expect(response.status).toBe(404);
    const result = await response.json();
    expect(result.error).toEqual(ApiError.ITEM_NOT_FOUND);
  });

  ['GET', 'DELETE', 'POST', 'PUT'].forEach(method => {
    it(`should not allow ${method} requests`, async () => {
      const response = await updateGoals({ method } as Request, dbManager as unknown as MongoDbManager, authManager);
      expect(response.status).toEqual(405);
    });
  });

  invalidGoalsRequests.forEach(body => {
    it(`should return validation error for invalid request body: ${JSON.stringify(body)}`, async () => {
      const request = new Request('http://localhost:8888', {
        method: 'PATCH',
        body: JSON.stringify(body),
      });
      const response = await updateGoals(request, dbManager as unknown as MongoDbManager, authManager);
      expect(response.status).toEqual(400);
      const data = await response.json();
      expect(data.error).toEqual(ApiError.REQUEST_VALIDATION_FAILED);
    });
  });
});
