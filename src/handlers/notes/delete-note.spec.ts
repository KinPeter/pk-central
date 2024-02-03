import { MockCollection, MockDb, MockDbManager } from '../../test-utils/mock/db.mock.js';
import { MongoDbManager } from '../../utils/mongo-db-manager.js';
import { MockAuthManager } from '../../test-utils/mock/auth.mock.js';
import { ApiError, ValidationError } from 'pk-common';
import { notes } from '../../test-utils/test-data/notes.js';
import { deleteNote } from './delete-note.js';

describe('deleteNote', () => {
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

  it('should delete a note', async () => {
    collection.findOneAndDelete.and.resolveTo(notes[0]);
    const request = new Request('http://localhost:8888', {
      method: 'DELETE',
    });
    const response = await deleteNote(request, notes[0].id, dbManager as unknown as MongoDbManager, authManager);
    expect(collection.findOneAndDelete).toHaveBeenCalledWith({ id: notes[0].id, userId: '123' });
    expect(response.status).toBe(200);
    const result = await response.json();
    expect(result.id).toEqual(notes[0].id);
  });

  it('should return bad request error for invalid uuid', async () => {
    collection.findOneAndDelete.and.resolveTo(notes[0]);
    const request = new Request('http://localhost:8888', {
      method: 'DELETE',
    });
    const response = await deleteNote(request, 'not-a-uuid', dbManager as unknown as MongoDbManager, authManager);
    expect(collection.findOneAndDelete).not.toHaveBeenCalled();
    expect(response.status).toBe(400);
    const result = await response.json();
    expect(result.error).toEqual(ValidationError.INVALID_UUID);
  });

  it('should return not found error if note is not found', async () => {
    collection.findOneAndDelete.and.resolveTo(null);
    const request = new Request('http://localhost:8888', {
      method: 'DELETE',
    });
    const response = await deleteNote(request, notes[0].id, dbManager as unknown as MongoDbManager, authManager);
    expect(collection.findOneAndDelete).toHaveBeenCalled();
    expect(response.status).toBe(404);
    const result = await response.json();
    expect(result.error).toEqual(ApiError.ITEM_NOT_FOUND);
  });
});
