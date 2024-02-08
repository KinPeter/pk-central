import { describe, beforeEach, it, expect } from '@jest/globals';
import { MockCollection, MockDb, MockDbManager } from '../../../test-utils/mock/db.mock';
import { MongoDbManager } from '../../../src/utils/mongo-db-manager';
import { MockAuthManager } from '../../../test-utils/mock/auth.mock';
import { updateSettings } from '../../../src/handlers/start-settings/update-settings';
import { ApiError, PkStartSettings } from 'pk-common';
import {
  invalidRequestBodies,
  updatedSettings,
  validSettings,
  validSettingsRequest,
} from '../../../test-utils/test-data/start-settings';

describe('updateSettings', () => {
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

  it('should create new settings if not exists', async () => {
    collection.findOne.mockResolvedValue(null);
    collection.insertOne.mockResolvedValue(true);
    collection.updateOne.mockResolvedValue(true);
    const request = new Request('http://localhost:8888', {
      method: 'PUT',
      body: JSON.stringify(validSettingsRequest),
    });
    const response = await updateSettings(request, dbManager as unknown as MongoDbManager, authManager);
    expect(collection.findOne).toHaveBeenCalledWith({ userId: '123' });
    expect(collection.insertOne).toHaveBeenCalled();
    expect(collection.findOneAndUpdate).not.toHaveBeenCalled();
    expect(response.status).toBe(200);
    const settings = (await response.json()) as PkStartSettings;
    expect(Object.keys(settings).length).toEqual(11);
    expect(settings.name).toEqual('testuser');
    expect(settings.weatherApiKey).toEqual('WeatherApiKey123');
    expect(settings.birthdaysUrl).toBeNull();
    expect(typeof settings.id).toEqual('string');
    expect(settings.hasOwnProperty('userId')).toBeFalsy();
  });

  it('should update existing settings', async () => {
    collection.findOne.mockResolvedValue(validSettings);
    collection.findOneAndUpdate.mockResolvedValue(updatedSettings);
    const request = new Request('http://localhost:8888', {
      method: 'PUT',
      body: JSON.stringify({
        ...validSettingsRequest,
        locationApiKey: 'apiKey123',
        koreanUrl: null,
        stravaClientId: 'clientId',
      }),
    });
    const response = await updateSettings(request, dbManager as unknown as MongoDbManager, authManager);
    expect(collection.findOne).toHaveBeenCalledWith({ userId: '123' });
    expect(collection.insertOne).not.toHaveBeenCalled();
    expect(collection.findOneAndUpdate).toHaveBeenCalled();
    expect(response.status).toBe(200);
    const settings = (await response.json()) as PkStartSettings;
    expect(Object.keys(settings).length).toEqual(11);
    expect(settings.koreanUrl).toBeNull();
    expect(settings.name).toEqual('testuser');
    expect(settings.weatherApiKey).toEqual('WeatherApiKey123');
    expect(settings.locationApiKey).toEqual('apiKey123');
    expect(settings.id).toEqual('abc123');
    expect(settings.hasOwnProperty('userId')).toBeFalsy();
  });

  invalidRequestBodies.forEach(body => {
    it(`should return validation error for invalid request body: ${JSON.stringify(body)}`, async () => {
      const request = new Request('http://localhost:8888', {
        method: 'PUT',
        body: JSON.stringify(body),
      });
      const response = await updateSettings(request, dbManager as unknown as MongoDbManager, authManager);
      expect(response.status).toEqual(400);
      const data = await response.json();
      expect(data.error).toEqual(ApiError.REQUEST_VALIDATION_FAILED);
    });
  });
});
