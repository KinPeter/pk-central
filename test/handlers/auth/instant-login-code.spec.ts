import { beforeEach, describe, expect, it } from '@jest/globals';
import { MockCollection, MockDb, MockDbManager } from '../../../test-utils/mock/db.mock';
import { MongoDbManager } from '../../../src/utils/mongo-db-manager';
import { ApiError, LOGIN_CODE_REGEX } from '../../../common';
import { instantLoginCode } from '../../../src/handlers/auth/instant-login-code';

describe('instantLoginCode', () => {
  let db: MockDb;
  let collection: MockCollection;
  let dbManager: MockDbManager;

  beforeEach(() => {
    process.env.JWT_SECRET = 'secret';
    process.env.LOGIN_CODE_EXPIRY = '15';
    process.env.TOKEN_EXPIRY = '7';
    process.env.PK_ENV = 'dev';
    process.env.EMAILS_ALLOWED = 'test@test.com';
    db = new MockDb();
    collection = new MockCollection();
    dbManager = new MockDbManager(db, collection);
    db.collection.mockReturnValue(collection);
  });

  it('should create new user and send login code', async () => {
    collection.findOne.mockResolvedValue(null);
    collection.insertOne.mockResolvedValue(true);
    collection.updateOne.mockResolvedValue(true);
    const request = new Request('http://localhost:8888', {
      method: 'POST',
      body: JSON.stringify({ email: 'test@test.com' }),
    });
    const response = await instantLoginCode(request, dbManager as unknown as MongoDbManager);
    expect(db.collection).toHaveBeenCalledWith('users');
    expect(collection.findOne).toHaveBeenCalledWith({ email: 'test@test.com' });
    expect(collection.insertOne).toHaveBeenCalled();
    expect(collection.updateOne).toHaveBeenCalled();
    expect(response.status).toBe(200);
    const data: any = await response.json();
    expect(data.loginCode).toMatch(LOGIN_CODE_REGEX);
  });

  it('should send login code for existing user', async () => {
    collection.findOne.mockResolvedValue({ id: '123', email: 'test@test.com' });
    collection.updateOne.mockResolvedValue(true);
    const request = new Request('http://localhost:8888', {
      method: 'POST',
      body: JSON.stringify({ email: 'test@test.com' }),
    });
    const response = await instantLoginCode(request, dbManager as unknown as MongoDbManager);
    expect(collection.findOne).toHaveBeenCalledWith({ email: 'test@test.com' });
    expect(collection.insertOne).not.toHaveBeenCalled();
    expect(collection.updateOne).toHaveBeenCalled();
    expect(response.status).toBe(200);
    const data: any = await response.json();
    expect(data.loginCode).toMatch(LOGIN_CODE_REGEX);
  });

  [undefined, 'prod'].forEach(env => {
    it(`should return forbidden error if not on DEV environment: PK_ENV = ${env}`, async () => {
      process.env.PK_ENV = env;
      collection.findOne.mockResolvedValue({ id: '123', email: 'test@test.com' });
      const request = new Request('http://localhost:8888', {
        method: 'POST',
        body: JSON.stringify({ email: 'test@test.com' }),
      });
      const response = await instantLoginCode(request, dbManager as unknown as MongoDbManager);
      expect(collection.updateOne).not.toHaveBeenCalled();
      expect(response.status).toBe(403);
      const data: any = await response.json();
      expect(data.error).toMatch(ApiError.FORBIDDEN_OPERATION);
    });
  });

  ['GET', 'PUT', 'DELETE', 'PATCH'].forEach(method => {
    it(`should not allow ${method} requests`, async () => {
      const response = await instantLoginCode({ method } as Request, dbManager as unknown as MongoDbManager);
      expect(response.status).toEqual(405);
    });
  });

  [{ email: null }, { email: 'not-an-email' }].forEach(body => {
    it(`should return validation error for invalid request body: ${JSON.stringify(body)}`, async () => {
      const request = new Request('http://localhost:8888', {
        method: 'POST',
        body: JSON.stringify(body),
      });
      const response = await instantLoginCode(request, dbManager as unknown as MongoDbManager);
      expect(response.status).toEqual(400);
      const data: any = await response.json();
      expect(data.error).toContain(ApiError.REQUEST_VALIDATION_FAILED);
    });
  });

  describe('Restriction for emails', () => {
    beforeEach(() => {
      collection.findOne.mockResolvedValue(null);
      collection.insertOne.mockResolvedValue(true);
      collection.updateOne.mockResolvedValue(true);
    });

    it('should let user sign up if email is in allowed list', async () => {
      process.env.EMAILS_ALLOWED = 'test@test.com,main@test.com';
      const request = new Request('http://localhost:8888', {
        method: 'POST',
        body: JSON.stringify({ email: 'test@test.com' }),
      });
      const response = await instantLoginCode(request, dbManager as unknown as MongoDbManager);
      expect(response.status).toBe(200);
    });

    it('should not let user sign up if email is not in allowed list', async () => {
      process.env.EMAILS_ALLOWED = 'other@test.com,main@test.com';
      const request = new Request('http://localhost:8888', {
        method: 'POST',
        body: JSON.stringify({ email: 'test@test.com' }),
      });
      const response = await instantLoginCode(request, dbManager as unknown as MongoDbManager);
      expect(response.status).toBe(403);
      const data: any = await response.json();
      expect(data.error).toContain(ApiError.FORBIDDEN_OPERATION);
    });
  });
});
