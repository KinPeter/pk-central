import { MockCollection, MockDb, MockDbManager } from '../../mock/db.mock.js';
import { MongoDbManager } from '../../utils/mongo-db-manager.js';
import { MockAuthManager } from '../../mock/auth.mock.js';
import { updateSettings } from './update-settings.js';
import { ApiError, PkStartSettings, PkStartSettingsRequest } from 'pk-common';

const validSettingsRequest: PkStartSettingsRequest = {
  name: 'testuser',
  weatherApiKey: 'WeatherApiKey123',
  locationApiKey: null,
  shortcutIconBaseUrl: 'https://other.p-kin.com/start-tile-icons/',
  birthdaysUrl: null,
  koreanUrl: 'https://docs.google.com/asd123aaa',
  stravaClientId: null,
  stravaClientSecret: null,
  stravaRedirectUri: null,
};

const validSettings: PkStartSettings = {
  ...validSettingsRequest,
  id: 'abc123',
  userId: '123',
};

const updatedSettings: PkStartSettings = {
  ...validSettings,
  locationApiKey: 'apiKey123',
  koreanUrl: null,
  stravaClientId: 'clientId',
};

const invalidRequestBodies = [
  {
    name: 'testuser',
    weatherApiKey: 'WeatherApiKey123',
    locationApiKey: null,
    shortcutIconBaseUrl: 'https://other.p-kin.com/start-tile-icons/',
    birthdaysUrl: null,
    koreanUrl: 'not-a-valid-url',
    stravaClientId: null,
    stravaClientSecret: null,
    stravaRedirectUri: null,
  },
  {
    name: 'testuser',
    weatherApiKey: 'WeatherApiKey123',
    locationApiKey: undefined,
    shortcutIconBaseUrl: 'https://other.p-kin.com/start-tile-icons/',
    birthdaysUrl: null,
    koreanUrl: 'https://docs.google.com/asd123aaa',
    stravaClientId: null,
    stravaClientSecret: null,
    stravaRedirectUri: null,
  },
  {
    name: 'testuser',
    weatherApiKey: 'WeatherApiKey123',
    locationApiKey: null,
    shortcutIconBaseUrl: 'https://other.p-kin.com/start-tile-icons/',
    birthdaysUrl: true,
    koreanUrl: 'https://docs.google.com/asd123aaa',
    stravaClientId: null,
    stravaClientSecret: null,
    stravaRedirectUri: null,
  },
  {
    name: 'testuser',
    locationApiKey: null,
    shortcutIconBaseUrl: 'https://other.p-kin.com/start-tile-icons/',
    birthdaysUrl: null,
    koreanUrl: 'https://docs.google.com/asd123aaa',
    stravaClientId: null,
    stravaClientSecret: null,
    stravaRedirectUri: null,
  },
];

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
    db.collection.and.returnValue(collection);
    authManager.authenticateUser.and.resolveTo({ id: '123' });
  });

  it('should create new settings if not exists', async () => {
    collection.findOne.and.resolveTo(null);
    collection.insertOne.and.resolveTo(true);
    collection.updateOne.and.resolveTo(true);
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
    expect(Object.keys(settings).length).toEqual(10);
    expect(settings.name).toEqual('testuser');
    expect(settings.weatherApiKey).toEqual('WeatherApiKey123');
    expect(settings.birthdaysUrl).toBeNull();
    expect(typeof settings.id).toEqual('string');
    expect(settings.hasOwnProperty('userId')).toBeFalse();
  });

  it('should update existing settings', async () => {
    collection.findOne.and.resolveTo(validSettings);
    collection.findOneAndUpdate.and.resolveTo(updatedSettings);
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
    expect(Object.keys(settings).length).toEqual(10);
    expect(settings.koreanUrl).toBeNull();
    expect(settings.name).toEqual('testuser');
    expect(settings.weatherApiKey).toEqual('WeatherApiKey123');
    expect(settings.locationApiKey).toEqual('apiKey123');
    expect(settings.id).toEqual('abc123');
    expect(settings.hasOwnProperty('userId')).toBeFalse();
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
