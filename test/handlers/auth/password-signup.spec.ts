import { describe, beforeEach, it, expect } from '@jest/globals';
import { MockCollection, MockDb, MockDbManager } from '../../../test-utils/mock/db.mock';
import { MockEmailManager } from '../../../test-utils/mock/email.mock';
import { MongoDbManager } from '../../../src/utils/mongo-db-manager';
import { EmailManager } from '../../../src/utils/email-manager';
import { ApiError } from 'pk-common';
import { passwordSignup } from '../../../src/handlers/auth/password-signup';

describe('passwordSignup', () => {
  let db: MockDb;
  let collection: MockCollection;
  let dbManager: MockDbManager;
  let emailManager: MockEmailManager;

  beforeEach(() => {
    process.env.JWT_SECRET = 'secret';
    process.env.LOGIN_CODE_EXPIRY = '15';
    process.env.TOKEN_EXPIRY = '7';
    process.env.EMAILS_ALLOWED = 'test@test.com';
    db = new MockDb();
    collection = new MockCollection();
    dbManager = new MockDbManager(db, collection);
    emailManager = new MockEmailManager();
    db.collection.mockReturnValue(collection);
  });

  it('should create new user', async () => {
    collection.findOne.mockResolvedValue(null);
    collection.insertOne.mockResolvedValue(true);
    emailManager.sendSignupNotification.mockResolvedValue(true);
    const request = new Request('http://localhost:8888', {
      method: 'POST',
      body: JSON.stringify({ email: 'test@test.com', password: 'password' }),
    });
    const response = await passwordSignup(
      request,
      dbManager as unknown as MongoDbManager,
      emailManager as unknown as EmailManager
    );
    expect(db.collection).toHaveBeenCalledWith('users');
    expect(collection.findOne).toHaveBeenCalledWith({ email: 'test@test.com' });
    expect(collection.insertOne).toHaveBeenCalled();
    expect(collection.updateOne).not.toHaveBeenCalled();
    expect(emailManager.sendSignupNotification).toHaveBeenCalled();
    expect(response.status).toBe(201);
  });

  it('should return conflict error if email is registered', async () => {
    collection.findOne.mockResolvedValue({ id: '123', email: 'test@test.com' });

    const request = new Request('http://localhost:8888', {
      method: 'POST',
      body: JSON.stringify({ email: 'test@test.com', password: 'password' }),
    });
    const response = await passwordSignup(
      request,
      dbManager as unknown as MongoDbManager,
      emailManager as unknown as EmailManager
    );
    expect(collection.findOne).toHaveBeenCalledWith({ email: 'test@test.com' });
    expect(collection.insertOne).not.toHaveBeenCalled();
    expect(emailManager.sendSignupNotification).not.toHaveBeenCalled();
    expect(response.status).toBe(409);
  });

  ['GET', 'PUT', 'DELETE', 'PATCH'].forEach(method => {
    it(`should not allow ${method} requests`, async () => {
      const response = await passwordSignup(
        { method } as Request,
        dbManager as unknown as MongoDbManager,
        emailManager as unknown as EmailManager
      );
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
      const response = await passwordSignup(
        request,
        dbManager as unknown as MongoDbManager,
        emailManager as unknown as EmailManager
      );
      expect(response.status).toEqual(400);
      const data = await response.json();
      expect(data.error).toContain(ApiError.REQUEST_VALIDATION_FAILED);
    });
  });

  describe('Restriction for emails', () => {
    beforeEach(() => {
      collection.findOne.mockResolvedValue(null);
      collection.insertOne.mockResolvedValue(true);
      emailManager.sendSignupNotification.mockResolvedValue(true);
    });

    it('should let user sign up if email is in allowed list', async () => {
      process.env.EMAILS_ALLOWED = 'test@test.com,main@test.com';
      const request = new Request('http://localhost:8888', {
        method: 'POST',
        body: JSON.stringify({ email: 'test@test.com', password: 'password' }),
      });
      const response = await passwordSignup(
        request,
        dbManager as unknown as MongoDbManager,
        emailManager as unknown as EmailManager
      );
      expect(response.status).toBe(201);
    });

    it('should not let user sign up if email is not in allowed list', async () => {
      process.env.EMAILS_ALLOWED = 'other@test.com,main@test.com';
      const request = new Request('http://localhost:8888', {
        method: 'POST',
        body: JSON.stringify({ email: 'test@test.com', password: 'password' }),
      });
      const response = await passwordSignup(
        request,
        dbManager as unknown as MongoDbManager,
        emailManager as unknown as EmailManager
      );
      expect(response.status).toBe(403);
      const data = await response.json();
      expect(data.error).toContain(ApiError.FORBIDDEN_OPERATION);
    });
  });
});
