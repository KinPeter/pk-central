import { describe, beforeEach, it, expect } from '@jest/globals';
import process from 'node:process';
import { MockCollection, MockDb, MockDbManager } from '../../../test-utils/mock/db.mock';
import { MockAuthManager } from '../../../test-utils/mock/auth.mock';
import { MongoDbManager } from '../../../src/utils/mongo-db-manager';
import { getSettings } from '../../../src/handlers/start-settings/get-settings';

const result = { _id: 'm1', id: 'uuid1', userId: 'user1', name: 'Peti' };

describe('getSettings', () => {
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
    process.env.OPEN_WEATHER_MAP_API_KEY = 'openWeatherMapApiKey';
    process.env.LOCATION_IQ_API_KEY = 'locationIqApiKey';
    process.env.UNSPLASH_API_KEY = 'unsplashApiKey';
    process.env.STRAVA_CLIENT_ID = 'stravaClientId';
    process.env.STRAVA_CLIENT_SECRET = 'stravaClientSecret';
  });

  it('should return result without object and user ids', async () => {
    collection.findOne.mockResolvedValueOnce(result);
    const response = await getSettings(
      { method: 'GET' } as Request,
      dbManager as unknown as MongoDbManager,
      authManager
    );
    expect(db.collection).toHaveBeenCalledWith('start-settings');
    expect(collection.findOne).toHaveBeenCalledWith({ userId: '123' });
    expect(response.status).toEqual(200);
    const data: any = await response.json();
    expect(Array.isArray(data)).toBeFalsy();
    expect(data.hasOwnProperty('_id')).toBeFalsy();
    expect(data.hasOwnProperty('userId')).toBeFalsy();
    expect(data.name).toBe('Peti');
    expect(data.id).toBe('uuid1');
  });

  it('should return not found error if no settings saved', async () => {
    collection.findOne.mockResolvedValue(null);
    const response = await getSettings(
      { method: 'GET' } as Request,
      dbManager as unknown as MongoDbManager,
      authManager
    );
    expect(response.status).toEqual(404);
  });

  it('should return server error if collection.findOne fails', async () => {
    collection.findOne.mockImplementation(() => {
      throw new Error();
    });
    const response = await getSettings(
      { method: 'GET' } as Request,
      dbManager as unknown as MongoDbManager,
      authManager
    );
    expect(response.status).toEqual(500);
  });
});
