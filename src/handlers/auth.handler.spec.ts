import { MockCollection, MockDb, MockDbManager } from '../mock/db.mock.js';
import { requestLoginCode } from './auth.handler.js';
import { Context } from '@netlify/functions';
import { MockAuthManager } from '../mock/auth.mock.js';
import { MockEmailManager } from '../mock/email.mock.js';
import { MongoDbManager } from '../utils/mongo-db-manager.js';
import { EmailManager } from '../utils/email-manager.js';

describe('Auth handler', () => {
  let db: MockDb;
  let collection: MockCollection;
  let dbManager: MockDbManager;
  let authManager: MockAuthManager;
  let emailManager: MockEmailManager;

  beforeEach(() => {
    process.env.JWT_SECRET = 'secret';
    process.env.LOGIN_CODE_EXPIRY = '15';
    process.env.TOKEN_EXPIRY = '7';
    db = new MockDb();
    collection = new MockCollection();
    dbManager = new MockDbManager(db, collection);
    emailManager = new MockEmailManager();
    authManager = new MockAuthManager();
    db.collection.and.returnValue(collection);
  });

  describe('requestLoginCode', () => {
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
        {} as Context,
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
        {} as Context,
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
  });
});
