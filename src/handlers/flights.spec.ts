import { getAllFlights } from './flights.js';
import { Context } from '@netlify/functions';
import { Db } from 'mongodb';
import { User } from '../types/users.js';
import { MockCollection, MockCursor, MockDb } from '../mock/db.js';

const twoResults = [
  { _id: 'm1', id: 'uuid1', userId: 'user1', date: '2023-12-16' },
  { _id: 'm2', id: 'uuid2', userId: 'user1', date: '2023-12-27' },
];

const notAllowedMethods = ['POST', 'PUT', 'DELETE', 'PATCH'];

describe('Flights handler', () => {
  let db: MockDb;
  let collection: MockCollection;
  let cursor: MockCursor;

  beforeEach(() => {
    db = new MockDb();
    collection = new MockCollection();
    cursor = new MockCursor();
    db.collection.and.returnValue(collection);
    collection.find.and.returnValue(cursor);
  });

  describe('getAllFlights', () => {
    it('should return flights without object and user ids', async () => {
      cursor.toArray.and.returnValue(twoResults);
      const response = await getAllFlights(
        { method: 'GET' } as Request,
        {} as Context,
        db as unknown as Db,
        { id: '123' } as User
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
      cursor.toArray.and.returnValue([]);
      const response = await getAllFlights(
        { method: 'GET' } as Request,
        {} as Context,
        db as unknown as Db,
        { id: '123' } as User
      );
      expect(response.status).toEqual(200);
      const data = await response.json();
      expect(Array.isArray(data)).toBeTrue();
      expect(data.length).toEqual(0);
    });

    notAllowedMethods.forEach(method => {
      it(`should not allow ${method} requests`, async () => {
        const response = await getAllFlights(
          { method } as Request,
          {} as Context,
          db as unknown as Db,
          { id: '123' } as User
        );
        expect(response.status).toEqual(405);
      });
    });

    it('should return server error if collection.find fails', async () => {
      collection.find.calls.reset();
      collection.find.and.throwError(new Error());
      const response = await getAllFlights(
        { method: 'GET' } as Request,
        {} as Context,
        db as unknown as Db,
        { id: '123' } as User
      );
      expect(response.status).toEqual(500);
    });
  });
});
