import { describe, beforeEach, it, expect } from '@jest/globals';
import { MockCollection, MockDb, MockDbManager } from '../../../test-utils/mock/db.mock';
import { MongoDbManager } from '../../../src/utils/mongo-db-manager';
import { MockAuthManager } from '../../../test-utils/mock/auth.mock';
import { ApiError, Activities } from '../../../common';
import { activitiesData } from '../../../test-utils/test-data/activities';
import { createInitialData } from '../../../src/handlers/activities/create-initial-data';

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
    db.collection.mockReturnValue(collection);
    authManager.authenticateUser.mockResolvedValue({ id: '123' });
  });

  it('should create initial activities data', async () => {
    collection.findOne.mockResolvedValue(null);
    collection.insertOne.mockResolvedValue(true);
    const request = new Request('http://localhost:8888', {
      method: 'POST',
      body: undefined,
    });
    const response = await createInitialData(request, dbManager as unknown as MongoDbManager, authManager);
    expect(db.collection).toHaveBeenCalledWith('activities');
    expect(collection.findOne).toHaveBeenCalledWith({ userId: '123' });
    expect(collection.insertOne).toHaveBeenCalled();
    expect(response.status).toBe(201);
    const result = (await response.json()) as Activities;
    expect(typeof result.id).toEqual('string');
    expect(result.cyclingWeeklyGoal).toEqual(0);
    expect(result.walkMonthlyGoal).toEqual(0);
  });

  it('should return already exists error if there is existing activities data', async () => {
    collection.findOne.mockResolvedValue(activitiesData);
    const request = new Request('http://localhost:8888', {
      method: 'POST',
      body: undefined,
    });
    const response = await createInitialData(request, dbManager as unknown as MongoDbManager, authManager);
    expect(collection.findOne).toHaveBeenCalledWith({ userId: '123' });
    expect(collection.insertOne).not.toHaveBeenCalled();
    expect(response.status).toBe(400);
    const result: any = await response.json();
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
