import { MockCollection, MockCursor, MockDb, MockDbManager } from '../../../test-utils/mock/db.mock';
import { MockAuthManager } from '../../../test-utils/mock/auth.mock';
import { MongoDbManager } from '../../utils/mongo-db-manager';
import { getAllFlights } from './get-all-flights';
import { twoResults } from '../../../test-utils/test-data/flights';

const notAllowedMethods = ['POST', 'PUT', 'DELETE', 'PATCH'];

describe('getAllFlights', () => {
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

  it('should return flights without object and user ids', async () => {
    cursor.toArray.and.resolveTo(twoResults);
    const response = await getAllFlights(
      { method: 'GET' } as Request,
      dbManager as unknown as MongoDbManager,
      authManager
    );
    expect(db.collection).toHaveBeenCalledWith('flights');
    expect(collection.find).toHaveBeenCalledWith({ userId: '123' });
    expect(response.status).toEqual(200);
    const data = await response.json();
    expect(Array.isArray(data)).toBeTrue();
    expect(data.length).toEqual(2);
    expect(data[0].hasOwnProperty('_id')).toBeFalse();
    expect(data[0].hasOwnProperty('userId')).toBeFalse();
    expect(data[1].hasOwnProperty('_id')).toBeFalse();
    expect(data[1].hasOwnProperty('userId')).toBeFalse();
    expect(data[0].date).toBe('2023-12-16');
    expect(data[1].id).toBe('uuid2');
  });

  it('should return empty array if no flights', async () => {
    cursor.toArray.and.resolveTo([]);
    const response = await getAllFlights(
      { method: 'GET' } as Request,
      dbManager as unknown as MongoDbManager,
      authManager
    );
    expect(response.status).toEqual(200);
    const data = await response.json();
    expect(Array.isArray(data)).toBeTrue();
    expect(data.length).toEqual(0);
  });

  notAllowedMethods.forEach(method => {
    it(`should not allow ${method} requests`, async () => {
      const response = await getAllFlights({ method } as Request, dbManager as unknown as MongoDbManager, authManager);
      expect(response.status).toEqual(405);
    });
  });

  it('should return server error if collection.find fails', async () => {
    collection.find.calls.reset();
    collection.find.and.throwError(new Error());
    const response = await getAllFlights(
      { method: 'GET' } as Request,
      dbManager as unknown as MongoDbManager,
      authManager
    );
    expect(response.status).toEqual(500);
  });
});
