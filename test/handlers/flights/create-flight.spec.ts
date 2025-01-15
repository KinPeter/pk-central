import { describe, beforeEach, it, expect } from '@jest/globals';
import { MockCollection, MockDb, MockDbManager } from '../../../test-utils/mock/db.mock';
import { MongoDbManager } from '../../../src/utils/mongo-db-manager';
import { MockAuthManager } from '../../../test-utils/mock/auth.mock';
import { ApiError } from '../../../common';
import { createFlight } from '../../../src/handlers/flights/create-flight';
import { invalidFlightRequests, validFlightRequests } from '../../../test-utils/test-data/flights';

describe('createFlight', () => {
  let db: MockDb;
  let collection: MockCollection;
  let dbManager: MockDbManager;
  let authManager: MockAuthManager;

  beforeEach(() => {
    db = new MockDb();
    collection = new MockCollection();
    dbManager = new MockDbManager(db, collection);
    authManager = new MockAuthManager();
    db.collection.mockReturnValue(collection);
    authManager.authenticateUser.mockResolvedValue({ id: '123' });
  });

  validFlightRequests.forEach((body, index) => {
    it(`should create new flight #${index + 1}`, async () => {
      collection.insertOne.mockResolvedValue(true);
      const request = new Request('http://localhost:8888', {
        method: 'POST',
        body: JSON.stringify(body),
      });
      const response = await createFlight(request, dbManager as unknown as MongoDbManager, authManager);
      expect(db.collection).toHaveBeenCalledWith('flights');
      expect(collection.insertOne).toHaveBeenCalled();
      expect(response.status).toBe(201);
      const result: any = await response.json();
      expect(result.hasOwnProperty('id')).toBeTruthy();
      expect(result.hasOwnProperty('createdAt')).toBeTruthy();
    });
  });

  invalidFlightRequests.forEach((body, index) => {
    it(`should return validation error for invalid request body #${index + 1}`, async () => {
      const request = new Request('http://localhost:8888', {
        method: 'POST',
        body: JSON.stringify(body),
      });
      const response = await createFlight(request, dbManager as unknown as MongoDbManager, authManager);
      expect(collection.insertOne).not.toHaveBeenCalled();
      expect(response.status).toEqual(400);
      const data: any = await response.json();
      expect(data.error).toEqual(ApiError.REQUEST_VALIDATION_FAILED);
    });
  });
});
