import { beforeEach, describe, expect, it } from '@jest/globals';
import { MockCollection, MockCursor, MockDb, MockDbManager } from '../../../test-utils/mock/db.mock';
import { MongoDbManager } from '../../../src/utils/mongo-db-manager';
import { getAllTrips } from '../../../src/handlers/public/get-all-trips';

describe('getAllTrips', () => {
  let db: MockDb;
  let collection: MockCollection;
  let cursor: MockCursor;
  let dbManager: MockDbManager;

  beforeEach(() => {
    db = new MockDb();
    collection = new MockCollection();
    cursor = new MockCursor();
    dbManager = new MockDbManager(db, collection);
    db.collection.mockReturnValue(collection);
    collection.find.mockReturnValue(cursor);
  });

  it('should call the proper methods', async () => {
    cursor.toArray.mockResolvedValue([]);
    const response = await getAllTrips(
      { method: 'GET' } as Request,
      'c2197832-6a6e-46c3-97a9-dd2a8de8a267',
      dbManager as unknown as MongoDbManager
    );
    expect(db.collection).toHaveBeenCalledTimes(2);
    expect(db.collection.mock.calls[0]).toEqual(['flights']);
    expect(db.collection.mock.calls[1]).toEqual(['visits']);
    expect(collection.find).toHaveBeenCalledTimes(2);
    expect(collection.find).toHaveBeenCalledWith({ userId: 'c2197832-6a6e-46c3-97a9-dd2a8de8a267' });
    expect(response.status).toEqual(200);
    const data = await response.json();
    expect(Array.isArray(data.flights)).toBeTruthy();
    expect(Array.isArray(data.visits)).toBeTruthy();
  });

  it('should return bad request error when called with non-valid uuid', async () => {
    const response = await getAllTrips(
      { method: 'GET' } as Request,
      'non-uuid',
      dbManager as unknown as MongoDbManager
    );
    expect(response.status).toEqual(400);
  });

  ['POST', 'PUT', 'DELETE', 'PATCH'].forEach(method => {
    it(`should not allow ${method} requests`, async () => {
      const response = await getAllTrips(
        { method } as Request,
        'c2197832-6a6e-46c3-97a9-dd2a8de8a267',
        dbManager as unknown as MongoDbManager
      );
      expect(response.status).toEqual(405);
    });
  });
});
