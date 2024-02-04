import { MockCollection, MockCursor, MockDb, MockDbManager } from '../../../test-utils/mock/db.mock';
import { MockAuthManager } from '../../../test-utils/mock/auth.mock';
import { MongoDbManager } from '../../utils/mongo-db-manager';
import { ApiError } from 'pk-common';
import { personalDataObjects } from '../../../test-utils/test-data/personal-data';
import { getPersonalData } from './get-personal-data';

describe('getPersonalData', () => {
  let db: MockDb;
  let collection: MockCollection;
  let dbManager: MockDbManager;
  let cursor: MockCursor;
  let authManager: MockAuthManager;

  beforeEach(() => {
    db = new MockDb();
    collection = new MockCollection();
    dbManager = new MockDbManager(db, collection);
    cursor = new MockCursor();
    authManager = new MockAuthManager();
    db.collection.and.returnValue(collection);
    collection.find.and.returnValue(cursor);
    authManager.authenticateUser.and.resolveTo({ id: '123' });
  });

  it('should return personal data without object and user ids', async () => {
    cursor.toArray.and.resolveTo(personalDataObjects);
    const response = await getPersonalData(
      { method: 'GET' } as Request,
      dbManager as unknown as MongoDbManager,
      authManager
    );
    expect(db.collection).toHaveBeenCalledWith('personal-data');
    expect(collection.find).toHaveBeenCalledWith({ userId: '123' });
    expect(response.status).toEqual(200);
    const data = await response.json();
    expect(Array.isArray(data)).toBeTrue();
    expect(data.length).toEqual(2);
    expect(data[0].hasOwnProperty('_id')).toBeFalse();
    expect(data[0].hasOwnProperty('userId')).toBeFalse();
    expect(data[1].hasOwnProperty('_id')).toBeFalse();
    expect(data[1].hasOwnProperty('userId')).toBeFalse();
    expect(data[0].name).toEqual('ID Card');
    expect(data[1].id).toEqual('e2197832-6a6e-46c3-97a9-dd2a8de8a267');
  });

  it('should return empty array if no data', async () => {
    cursor.toArray.and.resolveTo([]);
    const response = await getPersonalData(
      { method: 'GET' } as Request,
      dbManager as unknown as MongoDbManager,
      authManager
    );
    expect(collection.find).toHaveBeenCalledWith({ userId: '123' });
    expect(response.status).toEqual(200);
    const data = await response.json();
    expect(Array.isArray(data)).toBeTrue();
    expect(data.length).toEqual(0);
  });

  it('should return server error if collection.find fails', async () => {
    collection.find.and.throwError(new Error());
    const response = await getPersonalData(
      { method: 'GET' } as Request,
      dbManager as unknown as MongoDbManager,
      authManager
    );
    expect(collection.find).toHaveBeenCalledWith({ userId: '123' });
    expect(response.status).toEqual(500);
    const data = await response.json();
    expect(data.error).toEqual(ApiError.UNKNOWN_ERROR);
  });
});
