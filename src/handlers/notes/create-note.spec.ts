import { MockCollection, MockDb, MockDbManager } from '../../test-utils/mock/db.mock.js';
import { MongoDbManager } from '../../utils/mongo-db-manager.js';
import { MockAuthManager } from '../../test-utils/mock/auth.mock.js';
import { ApiError } from 'pk-common';
import { invalidNoteRequests, validNoteRequests } from '../../test-utils/test-data/notes.js';
import { createNote } from './create-note.js';

describe('createNote', () => {
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

  validNoteRequests.forEach((body, index) => {
    it(`should create new note #${index + 1}`, async () => {
      collection.insertOne.and.resolveTo(true);
      const request = new Request('http://localhost:8888', {
        method: 'POST',
        body: JSON.stringify(body),
      });
      const response = await createNote(request, dbManager as unknown as MongoDbManager, authManager);
      expect(collection.insertOne).toHaveBeenCalled();
      expect(response.status).toBe(201);
      const result = await response.json();
      expect(result.hasOwnProperty('id')).toBeTrue();
      expect(result.hasOwnProperty('createdAt')).toBeTrue();
    });
  });

  invalidNoteRequests.forEach(body => {
    it(`should return validation error for invalid request body: ${JSON.stringify(body)}`, async () => {
      const request = new Request('http://localhost:8888', {
        method: 'POST',
        body: JSON.stringify(body),
      });
      const response = await createNote(request, dbManager as unknown as MongoDbManager, authManager);
      expect(collection.insertOne).not.toHaveBeenCalled();
      expect(response.status).toEqual(400);
      const data = await response.json();
      expect(data.error).toEqual(ApiError.REQUEST_VALIDATION_FAILED);
    });
  });
});
