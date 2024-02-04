import { describe, beforeEach, it, expect } from '@jest/globals';
import { MockCollection, MockDb, MockDbManager } from '../../../test-utils/mock/db.mock';
import { MongoDbManager } from '../../../src/utils/mongo-db-manager';
import { verifyLoginCode } from '../../../src/handlers/auth/verify-login-code';
import { getLoginCode } from '../../../src/utils/crypt-jwt';
import { ApiError } from 'pk-common';

describe('verifyLoginCode', () => {
  let db: MockDb;
  let collection: MockCollection;
  let dbManager: MockDbManager;

  beforeEach(() => {
    process.env.JWT_SECRET = 'secret';
    process.env.TOKEN_EXPIRY = '7';
    process.env.LOGIN_CODE_EXPIRY = '15';
    db = new MockDb();
    collection = new MockCollection();
    dbManager = new MockDbManager(db, collection);
    db.collection.mockReturnValue(collection);
  });

  it('should return token for valid login code', async () => {
    const { loginCode, loginCodeExpires, hashedLoginCode, salt } = await getLoginCode('123');
    collection.findOne.mockResolvedValue({ id: '123', loginCode: hashedLoginCode, loginCodeExpires, salt });
    const request = new Request('http://localhost:8888', {
      method: 'POST',
      body: JSON.stringify({ email: 'test@test.com', loginCode }),
    });
    const response = await verifyLoginCode(request, dbManager as unknown as MongoDbManager);
    expect(response.status).toEqual(200);
    const data = await response.json();
    expect(typeof data.token).toBe('string');
    expect(typeof data.expiresAt).toBe('string');
  });

  it('should return not found error if user is not found', async () => {
    collection.findOne.mockResolvedValue(null);
    const request = new Request('http://localhost:8888', {
      method: 'POST',
      body: JSON.stringify({ email: 'test@test.com', loginCode: '123456' }),
    });
    const response = await verifyLoginCode(request, dbManager as unknown as MongoDbManager);
    expect(response.status).toEqual(404);
  });

  it('should return unauthorized error for invalid login code', async () => {
    const { loginCodeExpires, hashedLoginCode, salt } = await getLoginCode('123');
    collection.findOne.mockResolvedValue({ id: '123', loginCode: hashedLoginCode, loginCodeExpires, salt });
    const request = new Request('http://localhost:8888', {
      method: 'POST',
      body: JSON.stringify({ email: 'test@test.com', loginCode: '123456' }),
    });
    const response = await verifyLoginCode(request, dbManager as unknown as MongoDbManager);
    expect(response.status).toEqual(401);
    const data = await response.json();
    expect(data.error).toContain(ApiError.INVALID_LOGIN_CODE);
  });

  it('should return unauthorized error if no entry in the database', async () => {
    const { loginCode } = await getLoginCode('123');
    collection.findOne.mockResolvedValue({ id: '123' });
    const request = new Request('http://localhost:8888', {
      method: 'POST',
      body: JSON.stringify({ email: 'test@test.com', loginCode }),
    });
    const response = await verifyLoginCode(request, dbManager as unknown as MongoDbManager);
    expect(response.status).toEqual(401);
    const data = await response.json();
    expect(data.error).toContain(ApiError.INVALID_LOGIN_CODE);
  });

  ['GET', 'PUT', 'DELETE', 'PATCH'].forEach(method => {
    it(`should not allow ${method} requests`, async () => {
      const response = await verifyLoginCode({ method } as Request, dbManager as unknown as MongoDbManager);
      expect(response.status).toEqual(405);
    });
  });

  [
    { email: 'test@test.com' },
    { email: 'not-an-email', loginCode: '123456' },
    { email: 'test@test.com', loginCode: 123456 },
    { loginCode: '123456' },
    { email: 'test@email.com', loginCode: '1234567' },
    { email: 'test@email.com', loginCode: '123' },
    { email: 'test@email.com', loginCode: 'abcdef' },
  ].forEach(body => {
    it(`should return validation error for invalid request body: ${JSON.stringify(body)}`, async () => {
      const request = new Request('http://localhost:8888', {
        method: 'POST',
        body: JSON.stringify(body),
      });
      const response = await verifyLoginCode(request, dbManager as unknown as MongoDbManager);
      expect(response.status).toEqual(400);
    });
  });
});
