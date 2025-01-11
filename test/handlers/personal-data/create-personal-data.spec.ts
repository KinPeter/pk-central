import { describe, beforeEach, it, expect } from '@jest/globals';
import { MockCollection, MockDb, MockDbManager } from '../../../test-utils/mock/db.mock';
import { MongoDbManager } from '../../../src/utils/mongo-db-manager';
import { MockAuthManager } from '../../../test-utils/mock/auth.mock';
import { ApiError } from '../../../common';
import { invalidPersonalDataRequests, validPersonalDataRequests } from '../../../test-utils/test-data/personal-data';
import { createPersonalData } from '../../../src/handlers/personal-data/create-personal-data';

describe('createPersonalData', () => {
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

  validPersonalDataRequests.forEach((body, index) => {
    it(`should create new personal data #${index + 1}`, async () => {
      collection.insertOne.mockResolvedValue(true);
      const request = new Request('http://localhost:8888', {
        method: 'POST',
        body: JSON.stringify(body),
      });
      const response = await createPersonalData(request, dbManager as unknown as MongoDbManager, authManager);
      expect(db.collection).toHaveBeenCalledWith('personal-data');
      expect(collection.insertOne).toHaveBeenCalled();
      expect(response.status).toBe(201);
      const result = await response.json();
      expect(result.hasOwnProperty('id')).toBeTruthy();
      expect(result.hasOwnProperty('createdAt')).toBeTruthy();
    });
  });

  invalidPersonalDataRequests.forEach(body => {
    it(`should return validation error for invalid request body: ${JSON.stringify(body)}`, async () => {
      const request = new Request('http://localhost:8888', {
        method: 'POST',
        body: JSON.stringify(body),
      });
      const response = await createPersonalData(request, dbManager as unknown as MongoDbManager, authManager);
      expect(collection.insertOne).not.toHaveBeenCalled();
      expect(response.status).toEqual(400);
      const data = await response.json();
      expect(data.error).toEqual(ApiError.REQUEST_VALIDATION_FAILED);
    });
  });
});
