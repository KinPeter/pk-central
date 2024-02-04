import { MockCollection, MockDb, MockDbManager } from '../../../test-utils/mock/db.mock';
import { MockAuthManager } from '../../../test-utils/mock/auth.mock';
import { MongoDbManager } from '../../utils/mongo-db-manager';
import { getCycling } from './get-cycling';
import { ApiError } from 'pk-common';

const result = { _id: 'm1', id: 'uuid1', userId: '123', weeklyGoal: 200 };

describe('getCycling', () => {
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

  it('should return cycling data without object and user ids', async () => {
    collection.findOne.and.resolveTo(result);
    const response = await getCycling(
      { method: 'GET' } as Request,
      dbManager as unknown as MongoDbManager,
      authManager
    );
    expect(db.collection).toHaveBeenCalledWith('cycling');
    expect(collection.findOne).toHaveBeenCalledWith({ userId: '123' });
    expect(response.status).toEqual(200);
    const data = await response.json();
    expect(Array.isArray(data)).toBeFalse();
    expect(data.hasOwnProperty('_id')).toBeFalse();
    expect(data.hasOwnProperty('userId')).toBeFalse();
    expect(data.weeklyGoal).toBe(200);
    expect(data.id).toBe('uuid1');
  });

  it('should return not found error if no cycling data saved', async () => {
    collection.findOne.and.resolveTo(null);
    const response = await getCycling(
      { method: 'GET' } as Request,
      dbManager as unknown as MongoDbManager,
      authManager
    );
    expect(response.status).toEqual(404);
    const data = await response.json();
    expect(data.error).toEqual(ApiError.ITEM_NOT_FOUND);
  });

  it('should return server error if collection.findOne fails', async () => {
    collection.findOne.and.throwError(new Error());
    const response = await getCycling(
      { method: 'GET' } as Request,
      dbManager as unknown as MongoDbManager,
      authManager
    );
    expect(response.status).toEqual(500);
    const data = await response.json();
    expect(data.error).toEqual(ApiError.UNKNOWN_ERROR);
  });

  ['DELETE', 'PUT', 'POST', 'PATCH'].forEach(method => {
    it(`should not allow ${method} requests`, async () => {
      const response = await getCycling({ method } as Request, dbManager as unknown as MongoDbManager, authManager);
      expect(response.status).toEqual(405);
    });
  });
});
