import { describe, beforeEach, it, expect } from '@jest/globals';
import { MockCollection, MockDb, MockDbManager } from '../../../test-utils/mock/db.mock';
import { MongoDbManager } from '../../../src/utils/mongo-db-manager';
import { MockAuthManager } from '../../../test-utils/mock/auth.mock';
import { ApiError, ValidationError } from '../../../common';
import { visits } from '../../../test-utils/test-data/visits';
import { deleteVisit } from '../../../src/handlers/visits/delete-visit';

describe('deleteVisit', () => {
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

  it('should delete a visit', async () => {
    collection.findOneAndDelete.mockResolvedValue(visits[0]);
    const request = new Request('http://localhost:8888', {
      method: 'DELETE',
    });
    const response = await deleteVisit(request, visits[0].id, dbManager as unknown as MongoDbManager, authManager);
    expect(db.collection).toHaveBeenCalledWith('visits');
    expect(collection.findOneAndDelete).toHaveBeenCalledWith({ id: visits[0].id, userId: '123' });
    expect(response.status).toBe(200);
    const result = await response.json();
    expect(result.id).toEqual(visits[0].id);
  });

  it('should return bad request error for invalid uuid', async () => {
    collection.findOneAndDelete.mockResolvedValue(visits[0]);
    const request = new Request('http://localhost:8888', {
      method: 'DELETE',
    });
    const response = await deleteVisit(request, 'not-a-uuid', dbManager as unknown as MongoDbManager, authManager);
    expect(collection.findOneAndDelete).not.toHaveBeenCalled();
    expect(response.status).toBe(400);
    const result = await response.json();
    expect(result.error).toEqual(ValidationError.INVALID_UUID);
  });

  it('should return not found error if visit is not found', async () => {
    collection.findOneAndDelete.mockResolvedValue(null);
    const request = new Request('http://localhost:8888', {
      method: 'DELETE',
    });
    const response = await deleteVisit(request, visits[0].id, dbManager as unknown as MongoDbManager, authManager);
    expect(collection.findOneAndDelete).toHaveBeenCalled();
    expect(response.status).toBe(404);
    const result = await response.json();
    expect(result.error).toEqual(ApiError.ITEM_NOT_FOUND);
  });
});
