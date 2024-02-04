import { describe, beforeEach, it, expect } from '@jest/globals';
import { MockCollection, MockCursor, MockDb, MockDbManager } from '../../../test-utils/mock/db.mock';
import { MockAuthManager } from '../../../test-utils/mock/auth.mock';
import { MongoDbManager } from '../../../src/utils/mongo-db-manager';
import { getAllFlights } from '../../../src/handlers/flights/get-all-flights';
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
    db.collection.mockReturnValue(collection);
    collection.find.mockReturnValue(cursor);
    authManager.authenticateUser.mockResolvedValue({ id: '123' });
  });

  it('should return flights without object and user ids', async () => {
    cursor.toArray.mockResolvedValue(twoResults);
    const response = await getAllFlights(
      { method: 'GET' } as Request,
      dbManager as unknown as MongoDbManager,
      authManager
    );
    expect(db.collection).toHaveBeenCalledWith('flights');
    expect(collection.find).toHaveBeenCalledWith({ userId: '123' });
    expect(response.status).toEqual(200);
    const data = await response.json();
    expect(Array.isArray(data)).toBeTruthy();
    expect(data.length).toEqual(2);
    expect(data[0].hasOwnProperty('_id')).toBeFalsy();
    expect(data[0].hasOwnProperty('userId')).toBeFalsy();
    expect(data[1].hasOwnProperty('_id')).toBeFalsy();
    expect(data[1].hasOwnProperty('userId')).toBeFalsy();
    expect(data[0].date).toBe('2023-12-16');
    expect(data[1].id).toBe('uuid2');
  });

  it('should return empty array if no flights', async () => {
    cursor.toArray.mockResolvedValue([]);
    const response = await getAllFlights(
      { method: 'GET' } as Request,
      dbManager as unknown as MongoDbManager,
      authManager
    );
    expect(response.status).toEqual(200);
    const data = await response.json();
    expect(Array.isArray(data)).toBeTruthy();
    expect(data.length).toEqual(0);
  });

  notAllowedMethods.forEach(method => {
    it(`should not allow ${method} requests`, async () => {
      const response = await getAllFlights({ method } as Request, dbManager as unknown as MongoDbManager, authManager);
      expect(response.status).toEqual(405);
    });
  });

  it('should return server error if collection.find fails', async () => {
    collection.find.mockImplementation(() => {
      throw new Error();
    });
    const response = await getAllFlights(
      { method: 'GET' } as Request,
      dbManager as unknown as MongoDbManager,
      authManager
    );
    expect(response.status).toEqual(500);
  });
});
