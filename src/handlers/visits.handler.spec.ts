import { getAllVisits } from './visits.handler.js';
import { Context } from '@netlify/functions';
import { MockCollection, MockCursor, MockDb, MockDbManager } from '../mock/db.mock.js';
import { MockAuthManager } from '../mock/auth.mock.js';
import { MongoDbManager } from '../utils/mongo-db-manager.js';

const twoResults = [
  { _id: 'm1', id: 'uuid1', userId: 'user1', city: 'Chania' },
  { _id: 'm2', id: 'uuid2', userId: 'user1', city: 'Athens' },
];

const notAllowedMethods = ['POST', 'PUT', 'DELETE', 'PATCH'];

describe('Visits handler', () => {
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

  describe('getAllVisits', () => {
    it('should return visits without object and user ids', async () => {
      cursor.toArray.and.resolveTo(twoResults);
      const response = await getAllVisits(
        { method: 'GET' } as Request,
        {} as Context,
        dbManager as unknown as MongoDbManager,
        authManager
      );
      expect(db.collection).toHaveBeenCalledWith('visits');
      expect(collection.find).toHaveBeenCalledWith({ userId: '123' });
      expect(response.status).toEqual(200);
      const data = await response.json();
      expect(Array.isArray(data)).toBeTrue();
      expect(data.length).toEqual(2);
      expect(data[0].hasOwnProperty('_id')).toBeFalse();
      expect(data[0].hasOwnProperty('userId')).toBeFalse();
      expect(data[1].hasOwnProperty('_id')).toBeFalse();
      expect(data[1].hasOwnProperty('userId')).toBeFalse();
      expect(data[0].city).toBe('Chania');
      expect(data[1].id).toBe('uuid2');
    });

    it('should return empty array if no visits', async () => {
      cursor.toArray.and.resolveTo([]);
      const response = await getAllVisits(
        { method: 'GET' } as Request,
        {} as Context,
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
        const response = await getAllVisits(
          { method } as Request,
          {} as Context,
          dbManager as unknown as MongoDbManager,
          authManager
        );
        expect(response.status).toEqual(405);
      });
    });

    it('should return server error if collection.find fails', async () => {
      collection.find.calls.reset();
      collection.find.and.throwError(new Error());
      const response = await getAllVisits(
        { method: 'GET' } as Request,
        {} as Context,
        dbManager as unknown as MongoDbManager,
        authManager
      );
      expect(response.status).toEqual(500);
    });
  });
});
