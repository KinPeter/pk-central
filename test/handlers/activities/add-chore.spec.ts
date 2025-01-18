import { describe, beforeEach, it, expect } from '@jest/globals';
import { MockCollection, MockDb, MockDbManager } from '../../../test-utils/mock/db.mock';
import { MongoDbManager } from '../../../src/utils/mongo-db-manager';
import { MockAuthManager } from '../../../test-utils/mock/auth.mock';
import { Activities, ApiError } from '../../../common';
import { activitiesData, invalidChoreRequests, validChoreRequest } from '../../../test-utils/test-data/activities';
import { addChore } from '../../../src/handlers/activities/add-chore';

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
    db.collection.mockReturnValue(collection);
    authManager.authenticateUser.mockResolvedValue({ id: '123' });
  });

  it('should create new chore', async () => {
    collection.findOne.mockResolvedValue(activitiesData);
    collection.findOneAndUpdate.mockResolvedValue({
      ...activitiesData,
      chores: [...activitiesData.chores!, { ...validChoreRequest }],
    });
    const request = new Request('http://localhost:8888', {
      method: 'POST',
      body: JSON.stringify(validChoreRequest),
    });
    const response = await addChore(request, dbManager as unknown as MongoDbManager, authManager);
    expect(db.collection).toHaveBeenCalledWith('activities');
    expect(collection.findOne).toHaveBeenCalledWith({ userId: '123' });
    expect(collection.findOneAndUpdate).toHaveBeenCalled();
    expect(response.status).toBe(201);
    const result = (await response.json()) as Activities;
    expect(result.chores?.length).toEqual(2);
  });

  it('should return not found if there is no activities data', async () => {
    collection.findOne.mockResolvedValue(null);
    const request = new Request('http://localhost:8888', {
      method: 'POST',
      body: JSON.stringify(validChoreRequest),
    });
    const response = await addChore(request, dbManager as unknown as MongoDbManager, authManager);
    expect(collection.findOne).toHaveBeenCalledWith({ userId: '123' });
    expect(collection.findOneAndUpdate).not.toHaveBeenCalled();
    expect(response.status).toBe(404);
    const result: any = await response.json();
    expect(result.error).toEqual(ApiError.ITEM_NOT_FOUND);
  });

  it('should return not found if update does not find activities data', async () => {
    collection.findOne.mockResolvedValue(activitiesData);
    collection.findOneAndUpdate.mockResolvedValue(null);
    const request = new Request('http://localhost:8888', {
      method: 'POST',
      body: JSON.stringify(validChoreRequest),
    });
    const response = await addChore(request, dbManager as unknown as MongoDbManager, authManager);
    expect(collection.findOne).toHaveBeenCalledWith({ userId: '123' });
    expect(collection.findOneAndUpdate).toHaveBeenCalled();
    expect(response.status).toBe(404);
    const result: any = await response.json();
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
      const data: any = await response.json();
      expect(data.error).toEqual(ApiError.REQUEST_VALIDATION_FAILED);
    });
  });
});
