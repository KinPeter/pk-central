import { MockCollection, MockDb, MockDbManager } from '../../test-utils/mock/db.mock';
import { MongoDbManager } from '../../utils/mongo-db-manager';
import { MockAuthManager } from '../../test-utils/mock/auth.mock';
import { ApiError } from 'pk-common';
import { invalidShortcutRequests, validShortcutRequests } from '../../test-utils/test-data/shortcuts';
import { createShortcut } from './create-shortcut';

describe('createShortcut', () => {
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

  validShortcutRequests.forEach((body, index) => {
    it(`should create new shortcut #${index + 1}`, async () => {
      collection.insertOne.and.resolveTo(true);
      const request = new Request('http://localhost:8888', {
        method: 'POST',
        body: JSON.stringify(body),
      });
      const response = await createShortcut(request, dbManager as unknown as MongoDbManager, authManager);
      expect(collection.insertOne).toHaveBeenCalled();
      expect(response.status).toBe(201);
      const result = await response.json();
      expect(result.hasOwnProperty('id')).toBeTrue();
      expect(result.hasOwnProperty('createdAt')).toBeTrue();
    });
  });

  invalidShortcutRequests.forEach(body => {
    it(`should return validation error for invalid request body: ${JSON.stringify(body)}`, async () => {
      const request = new Request('http://localhost:8888', {
        method: 'POST',
        body: JSON.stringify(body),
      });
      const response = await createShortcut(request, dbManager as unknown as MongoDbManager, authManager);
      expect(collection.insertOne).not.toHaveBeenCalled();
      expect(response.status).toEqual(400);
      const data = await response.json();
      expect(data.error).toEqual(ApiError.REQUEST_VALIDATION_FAILED);
    });
  });
});
