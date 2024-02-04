import { MockCollection, MockDb, MockDbManager } from '../../../test-utils/mock/db.mock';
import { MongoDbManager } from '../../utils/mongo-db-manager';
import { MockAuthManager } from '../../../test-utils/mock/auth.mock';
import { ApiError, ValidationError } from 'pk-common';
import { shortcuts } from '../../../test-utils/test-data/shortcuts';
import { deleteShortcut } from './delete-shortcut';

describe('deleteShortcut', () => {
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

  it('should delete a shortcut', async () => {
    collection.findOneAndDelete.and.resolveTo(shortcuts[0]);
    const request = new Request('http://localhost:8888', {
      method: 'DELETE',
    });
    const response = await deleteShortcut(
      request,
      shortcuts[0].id,
      dbManager as unknown as MongoDbManager,
      authManager
    );
    expect(collection.findOneAndDelete).toHaveBeenCalledWith({ id: shortcuts[0].id, userId: '123' });
    expect(response.status).toBe(200);
    const result = await response.json();
    expect(result.id).toEqual(shortcuts[0].id);
  });

  it('should return bad request error for invalid uuid', async () => {
    collection.findOneAndDelete.and.resolveTo(shortcuts[0]);
    const request = new Request('http://localhost:8888', {
      method: 'DELETE',
    });
    const response = await deleteShortcut(request, 'not-a-uuid', dbManager as unknown as MongoDbManager, authManager);
    expect(collection.findOneAndDelete).not.toHaveBeenCalled();
    expect(response.status).toBe(400);
    const result = await response.json();
    expect(result.error).toEqual(ValidationError.INVALID_UUID);
  });

  it('should return not found error if shortcut is not found', async () => {
    collection.findOneAndDelete.and.resolveTo(null);
    const request = new Request('http://localhost:8888', {
      method: 'DELETE',
    });
    const response = await deleteShortcut(
      request,
      shortcuts[0].id,
      dbManager as unknown as MongoDbManager,
      authManager
    );
    expect(collection.findOneAndDelete).toHaveBeenCalled();
    expect(response.status).toBe(404);
    const result = await response.json();
    expect(result.error).toEqual(ApiError.ITEM_NOT_FOUND);
  });
});
