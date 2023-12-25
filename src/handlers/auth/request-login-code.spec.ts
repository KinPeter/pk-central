import { MockCollection, MockDb, MockDbManager } from '../../mock/db.mock.js';
import { MockEmailManager } from '../../mock/email.mock.js';
import { requestLoginCode } from './request-login-code.js';
import { MongoDbManager } from '../../utils/mongo-db-manager.js';
import { EmailManager } from '../../utils/email-manager.js';

describe('requestLoginCode', () => {
  let db: MockDb;
  let collection: MockCollection;
  let dbManager: MockDbManager;
  let emailManager: MockEmailManager;

  beforeEach(() => {
    process.env.JWT_SECRET = 'secret';
    process.env.LOGIN_CODE_EXPIRY = '15';
    process.env.TOKEN_EXPIRY = '7';
    db = new MockDb();
    collection = new MockCollection();
    dbManager = new MockDbManager(db, collection);
    emailManager = new MockEmailManager();
    db.collection.and.returnValue(collection);
  });

  it('should create new user and send login code', async () => {
    collection.findOne.and.resolveTo(null);
    collection.insertOne.and.resolveTo(true);
    collection.updateOne.and.resolveTo(true);
    emailManager.sendSignupNotification.and.resolveTo(true);
    const request = new Request('http://localhost:8888', {
      method: 'POST',
      body: JSON.stringify({ email: 'test@test.com' }),
    });
    const response = await requestLoginCode(
      request,
      dbManager as unknown as MongoDbManager,
      emailManager as unknown as EmailManager
    );
    expect(collection.findOne).toHaveBeenCalledWith({ email: 'test@test.com' });
    expect(collection.insertOne).toHaveBeenCalled();
    expect(collection.updateOne).toHaveBeenCalled();
    expect(emailManager.sendSignupNotification).toHaveBeenCalled();
    expect(emailManager.sendLoginCode).toHaveBeenCalled();
    expect(response.status).toBe(200);
  });

  it('should send login code for existing user', async () => {
    collection.findOne.and.resolveTo({ id: '123', email: 'test@test.com' });
    collection.updateOne.and.resolveTo(true);
    const request = new Request('http://localhost:8888', {
      method: 'POST',
      body: JSON.stringify({ email: 'test@test.com' }),
    });
    const response = await requestLoginCode(
      request,
      dbManager as unknown as MongoDbManager,
      emailManager as unknown as EmailManager
    );
    expect(collection.findOne).toHaveBeenCalledWith({ email: 'test@test.com' });
    expect(collection.insertOne).not.toHaveBeenCalled();
    expect(collection.updateOne).toHaveBeenCalled();
    expect(emailManager.sendSignupNotification).not.toHaveBeenCalled();
    expect(emailManager.sendLoginCode).toHaveBeenCalled();
    expect(response.status).toBe(200);
  });

  ['GET', 'PUT', 'DELETE', 'PATCH'].forEach(method => {
    it(`should not allow ${method} requests`, async () => {
      const response = await requestLoginCode(
        { method } as Request,
        dbManager as unknown as MongoDbManager,
        emailManager as unknown as EmailManager
      );
      expect(response.status).toEqual(405);
    });
  });

  [{ email: null }, { email: 'not-an-email' }].forEach(body => {
    it(`should return validation error for invalid request body: ${JSON.stringify(body)}`, async () => {
      const request = new Request('http://localhost:8888', {
        method: 'POST',
        body: JSON.stringify(body),
      });
      const response = await requestLoginCode(
        request,
        dbManager as unknown as MongoDbManager,
        emailManager as unknown as EmailManager
      );
      expect(response.status).toEqual(400);
      const data = await response.json();
      expect(data.details[0]).toContain('email');
    });
  });
});
