import { describe, beforeEach, it, expect } from '@jest/globals';
import { MockCollection, MockDb, MockDbManager } from '../../../test-utils/mock/db.mock';
import { MongoDbManager } from '../../../src/utils/mongo-db-manager';
import { getHashed } from '../../../src/utils/crypt-jwt';
import { ApiError } from '../../../common';
import { passwordLogin } from '../../../src/handlers/auth/password-login';

describe('passwordLogin', () => {
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

  it('should return token for valid password', async () => {
    const { hashedString: passwordHash, salt: passwordSalt } = await getHashed('password');
    collection.findOne.mockResolvedValue({ id: '123', passwordHash, passwordSalt });
    const request = new Request('http://localhost:8888', {
      method: 'POST',
      body: JSON.stringify({ email: 'test@test.com', password: 'password' }),
    });
    const response = await passwordLogin(request, dbManager as unknown as MongoDbManager);
    expect(db.collection).toHaveBeenCalledWith('users');
    expect(response.status).toEqual(200);
    const data = await response.json();
    expect(typeof data.token).toBe('string');
    expect(typeof data.expiresAt).toBe('string');
  });

  it('should return not found error if user is not found', async () => {
    collection.findOne.mockResolvedValue(null);
    const request = new Request('http://localhost:8888', {
      method: 'POST',
      body: JSON.stringify({ email: 'test@test.com', password: 'password' }),
    });
    const response = await passwordLogin(request, dbManager as unknown as MongoDbManager);
    expect(response.status).toEqual(404);
  });

  it('should return unauthorized error for invalid password', async () => {
    const { hashedString: passwordHash, salt: passwordSalt } = await getHashed('password');
    collection.findOne.mockResolvedValue({ id: '123', passwordHash, passwordSalt });
    const request = new Request('http://localhost:8888', {
      method: 'POST',
      body: JSON.stringify({ email: 'test@test.com', password: 'passwords123' }),
    });
    const response = await passwordLogin(request, dbManager as unknown as MongoDbManager);
    expect(response.status).toEqual(401);
    const data = await response.json();
    expect(data.error).toContain(ApiError.INVALID_PASSWORD);
  });

  it('should return unauthorized error if no hashed entry in the database', async () => {
    collection.findOne.mockResolvedValue({ id: '123' });
    const request = new Request('http://localhost:8888', {
      method: 'POST',
      body: JSON.stringify({ email: 'test@test.com', password: 'password' }),
    });
    const response = await passwordLogin(request, dbManager as unknown as MongoDbManager);
    expect(response.status).toEqual(401);
    const data = await response.json();
    expect(data.error).toContain(ApiError.INVALID_PASSWORD);
  });

  ['GET', 'PUT', 'DELETE', 'PATCH'].forEach(method => {
    it(`should not allow ${method} requests`, async () => {
      const response = await passwordLogin({ method } as Request, dbManager as unknown as MongoDbManager);
      expect(response.status).toEqual(405);
    });
  });

  [
    { email: 'test@test.com' },
    { email: 'not-an-email', password: 'password' },
    { email: 'test@test.com', password: 123456 },
    { password: 'password' },
    { email: 'test@email.com', password: '123' },
  ].forEach(body => {
    it(`should return validation error for invalid request body: ${JSON.stringify(body)}`, async () => {
      const request = new Request('http://localhost:8888', {
        method: 'POST',
        body: JSON.stringify(body),
      });
      const response = await passwordLogin(request, dbManager as unknown as MongoDbManager);
      expect(response.status).toEqual(400);
    });
  });
});
