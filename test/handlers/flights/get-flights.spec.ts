import { describe, it, beforeEach, expect } from '@jest/globals';
import { MockDb, MockCollection, MockCursor, MockDbManager } from '../../../test-utils/mock/db.mock';
import { MockAuthManager } from '../../../test-utils/mock/auth.mock';
import { MongoDbManager } from '../../../src/utils/mongo-db-manager';
import { AuthManager } from '../../../src/utils/auth-manager';
import { ApiError } from '../../../common';
import { getFlights } from '../../../src/handlers/flights/get-flights';
import { flights } from '../../../test-utils/test-data/flights';

describe('getFlights', () => {
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
    cursor.toArray.mockResolvedValue(flights);
    const request = new Request('http://localhost:8888', { method: 'GET' });
    const response = await getFlights(request, dbManager as unknown as MongoDbManager, authManager as AuthManager);
    expect(db.collection).toHaveBeenCalledWith('flights');
    expect(collection.find).toHaveBeenCalledWith({ userId: '123' });
    expect(response.status).toEqual(200);
    const data: any = await response.json();
    expect(Array.isArray(data)).toBeTruthy();
    expect(data.length).toEqual(2);
    expect(data[0].hasOwnProperty('_id')).toBeFalsy();
    expect(data[0].hasOwnProperty('userId')).toBeFalsy();
    expect(data[1].hasOwnProperty('_id')).toBeFalsy();
    expect(data[1].hasOwnProperty('userId')).toBeFalsy();
    expect(data[0].date).toEqual('2023-12-16');
    expect(data[1].id).toEqual('b2197832-6a6e-46c3-97a9-dd2a8de8a267');
  });

  it('should return only planned flights with plannedOnly queryParam', async () => {
    cursor.toArray.mockResolvedValue([flights[0]]);
    const request = new Request('http://localhost:8888?plannedOnly=true', { method: 'GET' });
    const response = await getFlights(request, dbManager as unknown as MongoDbManager, authManager as AuthManager);
    expect(db.collection).toHaveBeenCalledWith('flights');
    expect(collection.find).toHaveBeenCalledWith({ userId: '123', isPlanned: true });
    expect(response.status).toEqual(200);
    const data: any = await response.json();
    expect(Array.isArray(data)).toBeTruthy();
    expect(data.length).toEqual(1);
  });

  it('should return empty array if no flights', async () => {
    cursor.toArray.mockResolvedValue([]);
    const request = new Request('http://localhost:8888', { method: 'GET' });
    const response = await getFlights(request, dbManager as unknown as MongoDbManager, authManager);
    expect(collection.find).toHaveBeenCalledWith({ userId: '123' });
    expect(response.status).toEqual(200);
    const data: any = await response.json();
    expect(Array.isArray(data)).toBeTruthy();
    expect(data.length).toEqual(0);
  });

  it('should return server error if collection.find fails', async () => {
    collection.find.mockReturnValue(new Error());
    const request = new Request('http://localhost:8888', { method: 'GET' });
    const response = await getFlights(request, dbManager as unknown as MongoDbManager, authManager);
    expect(collection.find).toHaveBeenCalledWith({ userId: '123' });
    expect(response.status).toEqual(500);
    const data: any = await response.json();
    expect(data.error).toEqual(ApiError.UNKNOWN_ERROR);
  });
});
