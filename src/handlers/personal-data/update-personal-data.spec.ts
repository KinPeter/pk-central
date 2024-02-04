import { MockCollection, MockDb, MockDbManager } from '../../test-utils/mock/db.mock';
import { MongoDbManager } from '../../utils/mongo-db-manager';
import { MockAuthManager } from '../../test-utils/mock/auth.mock';
import { ApiError, ValidationError } from 'pk-common';
import {
  invalidPersonalDataRequests,
  personalDataObjects,
  validPersonalDataRequests,
} from '../../test-utils/test-data/personal-data';
import { updatePersonalData } from './update-personal-data';

describe('updatePersonalData', () => {
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

  validPersonalDataRequests.forEach((body, index) => {
    it(`should update a personal data #${index + 1}`, async () => {
      collection.findOneAndUpdate.and.resolveTo(personalDataObjects[0]);
      const request = new Request('http://localhost:8888', {
        method: 'PUT',
        body: JSON.stringify(body),
      });
      const response = await updatePersonalData(
        request,
        personalDataObjects[0].id,
        dbManager as unknown as MongoDbManager,
        authManager
      );
      expect(collection.findOneAndUpdate).toHaveBeenCalled();
      expect(response.status).toBe(200);
      const result = await response.json();
      expect(result.id).toEqual(personalDataObjects[0].id);
    });
  });

  it('should return bad request error for invalid uuid', async () => {
    collection.findOneAndUpdate.and.resolveTo(personalDataObjects[0]);
    const request = new Request('http://localhost:8888', {
      method: 'PUT',
      body: JSON.stringify(validPersonalDataRequests[0]),
    });
    const response = await updatePersonalData(
      request,
      'not-a-uuid',
      dbManager as unknown as MongoDbManager,
      authManager
    );
    expect(collection.findOneAndUpdate).not.toHaveBeenCalled();
    expect(response.status).toBe(400);
    const result = await response.json();
    expect(result.error).toEqual(ValidationError.INVALID_UUID);
  });

  it('should return not found error if data is not found', async () => {
    collection.findOneAndUpdate.and.resolveTo(null);
    const request = new Request('http://localhost:8888', {
      method: 'PUT',
      body: JSON.stringify(validPersonalDataRequests[0]),
    });
    const response = await updatePersonalData(
      request,
      personalDataObjects[0].id,
      dbManager as unknown as MongoDbManager,
      authManager
    );
    expect(collection.findOneAndUpdate).toHaveBeenCalled();
    expect(response.status).toBe(404);
    const result = await response.json();
    expect(result.error).toEqual(ApiError.ITEM_NOT_FOUND);
  });

  invalidPersonalDataRequests.forEach(body => {
    it(`should return validation error for invalid request body: ${JSON.stringify(body)}`, async () => {
      const request = new Request('http://localhost:8888', {
        method: 'PUT',
        body: JSON.stringify(body),
      });
      const response = await updatePersonalData(
        request,
        personalDataObjects[0].id,
        dbManager as unknown as MongoDbManager,
        authManager
      );
      expect(collection.findOneAndUpdate).not.toHaveBeenCalled();
      expect(response.status).toEqual(400);
      const data = await response.json();
      expect(data.error).toEqual(ApiError.REQUEST_VALIDATION_FAILED);
    });
  });
});
