import { describe, beforeEach, it, expect } from '@jest/globals';
import { MockCollection, MockDb } from '../../test-utils/mock/db.mock';
import { getAccessToken } from '../../src/utils/crypt-jwt';
import { AuthManager } from '../../src/utils/auth-manager';
import { Db } from 'mongodb';

describe('AuthManager', () => {
  let db: MockDb;
  let collection: MockCollection;
  let authManager: AuthManager;

  beforeEach(() => {
    process.env.TOKEN_EXPIRY = '7';
    process.env.JWT_SECRET = 'secret';
    db = new MockDb();
    collection = new MockCollection();
    authManager = new AuthManager();
    db.collection.mockReturnValue(collection);
  });

  describe('authenticateUser', () => {
    it('should get the user from the authorization header', async () => {
      collection.findOne.mockResolvedValue({ id: '123', email: 'test@test.com' });
      const { token } = getAccessToken('test@test.com', '123');
      const request = new Request('http://localhost:8888', { headers: { Authorization: `Bearer ${token}` } });
      const user = await authManager.authenticateUser(request, db as unknown as Db);
      expect(db.collection).toHaveBeenCalledWith('users');
      expect(user?.id).toEqual('123');
      expect(user?.email).toEqual('test@test.com');
    });

    it('should return null with invalid access token', async () => {
      collection.findOne.mockResolvedValue({ id: '123', email: 'test@test.com' });
      const request = new Request('http://localhost:8888', { headers: { Authorization: `Bearer invalidToken` } });
      const user = await authManager.authenticateUser(request, db as unknown as Db);
      expect(db.collection).not.toHaveBeenCalled();
      expect(collection.findOne).not.toHaveBeenCalled();
      expect(user).toBeNull();
    });

    it('should return null if the user email does not match', async () => {
      collection.findOne.mockResolvedValue({ id: '123', email: 'test1@test.com' });
      const { token } = getAccessToken('test2@test.com', '123');
      const request = new Request('http://localhost:8888', { headers: { Authorization: `Bearer ${token}` } });
      const user = await authManager.authenticateUser(request, db as unknown as Db);
      expect(db.collection).toHaveBeenCalledWith('users');
      expect(collection.findOne).toHaveBeenCalled();
      expect(user).toBeNull();
    });
  });
});
