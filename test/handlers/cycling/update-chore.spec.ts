import { describe, beforeEach, it, expect } from '@jest/globals';
import { MockCollection, MockDb, MockDbManager } from '../../../test-utils/mock/db.mock';
import { MongoDbManager } from '../../../src/utils/mongo-db-manager';
import { MockAuthManager } from '../../../test-utils/mock/auth.mock';
import { ApiError, Cycling } from 'pk-common';
import { cyclingData, invalidChoreRequests, validChoreRequest } from '../../../test-utils/test-data/cycling';
import { updateChore } from '../../../src/handlers/cycling/update-chore';

describe('updateChore', () => {
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

  it('should update chore by id', async () => {
    collection.findOne.mockResolvedValue(cyclingData);
    collection.findOneAndUpdate.mockResolvedValue(cyclingData);
    const request = new Request('http://localhost:8888', {
      method: 'PUT',
      body: JSON.stringify(validChoreRequest),
    });
    const response = await updateChore(request, 'c1', dbManager as unknown as MongoDbManager, authManager);
    expect(collection.findOne).toHaveBeenCalledWith({ userId: '123' });
    expect(collection.findOneAndUpdate).toHaveBeenCalled();
    expect(response.status).toBe(200);
    const result = (await response.json()) as Cycling;
    expect(result.chores?.length).toEqual(1);
  });

  it('should return not found if no cycling data', async () => {
    collection.findOne.mockResolvedValue(null);
    const request = new Request('http://localhost:8888', {
      method: 'PUT',
      body: JSON.stringify(validChoreRequest),
    });
    const response = await updateChore(request, 'c1', dbManager as unknown as MongoDbManager, authManager);
    expect(collection.findOne).toHaveBeenCalledWith({ userId: '123' });
    expect(collection.findOneAndUpdate).not.toHaveBeenCalled();
    expect(response.status).toBe(404);
    const result = await response.json();
    expect(result.error).toEqual(ApiError.ITEM_NOT_FOUND);
  });

  it('should return not found if id is incorrect', async () => {
    collection.findOne.mockResolvedValue(cyclingData);
    const request = new Request('http://localhost:8888', {
      method: 'PUT',
      body: JSON.stringify(validChoreRequest),
    });
    const response = await updateChore(request, 'c2', dbManager as unknown as MongoDbManager, authManager);
    expect(collection.findOne).toHaveBeenCalledWith({ userId: '123' });
    expect(collection.findOneAndUpdate).not.toHaveBeenCalled();
    expect(response.status).toBe(404);
    const result = await response.json();
    expect(result.error).toEqual(ApiError.ITEM_NOT_FOUND);
  });

  it('should return not found if no chores', async () => {
    collection.findOne.mockResolvedValue({ ...cyclingData, chores: [] });
    const request = new Request('http://localhost:8888', {
      method: 'PUT',
      body: JSON.stringify(validChoreRequest),
    });
    const response = await updateChore(request, 'c1', dbManager as unknown as MongoDbManager, authManager);
    expect(collection.findOne).toHaveBeenCalledWith({ userId: '123' });
    expect(collection.findOneAndUpdate).not.toHaveBeenCalled();
    expect(response.status).toBe(404);
    const result = await response.json();
    expect(result.error).toEqual(ApiError.ITEM_NOT_FOUND);
  });

  ['GET', 'DELETE', 'POST', 'PATCH'].forEach(method => {
    it(`should not allow ${method} requests`, async () => {
      const response = await updateChore(
        { method } as Request,
        'c1',
        dbManager as unknown as MongoDbManager,
        authManager
      );
      expect(response.status).toEqual(405);
    });
  });

  invalidChoreRequests.forEach(body => {
    it(`should return validation error for invalid request body: ${JSON.stringify(body)}`, async () => {
      const request = new Request('http://localhost:8888', {
        method: 'PUT',
        body: JSON.stringify(body),
      });
      const response = await updateChore(request, 'c1', dbManager as unknown as MongoDbManager, authManager);
      expect(response.status).toEqual(400);
      const data = await response.json();
      expect(data.error).toEqual(ApiError.REQUEST_VALIDATION_FAILED);
    });
  });
});
