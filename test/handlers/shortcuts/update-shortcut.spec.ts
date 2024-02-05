import { describe, beforeEach, it, expect } from '@jest/globals';
import { MockCollection, MockDb, MockDbManager } from '../../../test-utils/mock/db.mock';
import { MongoDbManager } from '../../../src/utils/mongo-db-manager';
import { MockAuthManager } from '../../../test-utils/mock/auth.mock';
import { ApiError, ValidationError } from 'pk-common';
import { invalidShortcutRequests, shortcuts, validShortcutRequests } from '../../../test-utils/test-data/shortcuts';
import { updateShortcut } from '../../../src/handlers/shortcuts/update-shortcut';

describe('updateShortcut', () => {
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

  validShortcutRequests.forEach((body, index) => {
    it(`should update a shortcut #${index + 1}`, async () => {
      collection.findOneAndUpdate.mockResolvedValue(shortcuts[0]);
      const request = new Request('http://localhost:8888', {
        method: 'PUT',
        body: JSON.stringify(body),
      });
      const response = await updateShortcut(
        request,
        shortcuts[0].id,
        dbManager as unknown as MongoDbManager,
        authManager
      );
      expect(db.collection).toHaveBeenCalledWith('shortcuts');
      expect(collection.findOneAndUpdate).toHaveBeenCalled();
      expect(response.status).toBe(200);
      const result = await response.json();
      expect(result.id).toEqual(shortcuts[0].id);
    });
  });

  it('should return bad request error for invalid uuid', async () => {
    collection.findOneAndUpdate.mockResolvedValue(shortcuts[0]);
    const request = new Request('http://localhost:8888', {
      method: 'PUT',
      body: JSON.stringify(validShortcutRequests[0]),
    });
    const response = await updateShortcut(request, 'not-a-uuid', dbManager as unknown as MongoDbManager, authManager);
    expect(collection.findOneAndUpdate).not.toHaveBeenCalled();
    expect(response.status).toBe(400);
    const result = await response.json();
    expect(result.error).toEqual(ValidationError.INVALID_UUID);
  });

  it('should return not found error if shortcut is not found', async () => {
    collection.findOneAndUpdate.mockResolvedValue(null);
    const request = new Request('http://localhost:8888', {
      method: 'PUT',
      body: JSON.stringify(validShortcutRequests[0]),
    });
    const response = await updateShortcut(
      request,
      shortcuts[0].id,
      dbManager as unknown as MongoDbManager,
      authManager
    );
    expect(collection.findOneAndUpdate).toHaveBeenCalled();
    expect(response.status).toBe(404);
    const result = await response.json();
    expect(result.error).toEqual(ApiError.ITEM_NOT_FOUND);
  });

  invalidShortcutRequests.forEach(body => {
    it(`should return validation error for invalid request body: ${JSON.stringify(body)}`, async () => {
      const request = new Request('http://localhost:8888', {
        method: 'PUT',
        body: JSON.stringify(body),
      });
      const response = await updateShortcut(
        request,
        shortcuts[0].id,
        dbManager as unknown as MongoDbManager,
        authManager
      );
      expect(collection.findOneAndUpdate).not.toHaveBeenCalled();
      expect(response.status).toEqual(400);
      const data = await response.json();
      expect(data.error).toEqual(ApiError.REQUEST_VALIDATION_FAILED);
    });
  });
});
