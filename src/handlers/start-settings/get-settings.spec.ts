import { MockCollection, MockDb, MockDbManager } from '../../test-utils/mock/db.mock';
import { MockAuthManager } from '../../test-utils/mock/auth.mock';
import { MongoDbManager } from '../../utils/mongo-db-manager';
import { getSettings } from './get-settings';

const result = { _id: 'm1', id: 'uuid1', userId: 'user1', name: 'Peti' };

describe('getSettings', () => {
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

  it('should return result without object and user ids', async () => {
    collection.findOne.and.resolveTo(result);
    const response = await getSettings(
      { method: 'GET' } as Request,
      dbManager as unknown as MongoDbManager,
      authManager
    );
    expect(db.collection).toHaveBeenCalledWith('start-settings');
    expect(collection.findOne).toHaveBeenCalledWith({ userId: '123' });
    expect(response.status).toEqual(200);
    const data = await response.json();
    expect(Array.isArray(data)).toBeFalse();
    expect(data.hasOwnProperty('_id')).toBeFalse();
    expect(data.hasOwnProperty('userId')).toBeFalse();
    expect(data.name).toBe('Peti');
    expect(data.id).toBe('uuid1');
  });

  it('should return not found error if no settings saved', async () => {
    collection.findOne.and.resolveTo(null);
    const response = await getSettings(
      { method: 'GET' } as Request,
      dbManager as unknown as MongoDbManager,
      authManager
    );
    expect(response.status).toEqual(404);
  });

  it('should return server error if collection.findOne fails', async () => {
    collection.findOne.and.throwError(new Error());
    const response = await getSettings(
      { method: 'GET' } as Request,
      dbManager as unknown as MongoDbManager,
      authManager
    );
    expect(response.status).toEqual(500);
  });
});
