import { MockCollection, MockDb, MockDbManager } from '../../test-utils/mock/db.mock';
import { MongoDbManager } from '../../utils/mongo-db-manager';
import { getLoginCode } from '../../utils/crypt-jwt';
import { verifyMagicLink } from './verify-magic-link';
import { Context } from '@netlify/functions';
import { ApiError } from 'pk-common';

describe('verifyMagicLink', () => {
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
    db.collection.and.returnValue(collection);
  });

  it('should return a redirect response for valid magic link', async () => {
    const { magicLinkToken } = await getLoginCode('123');
    collection.findOne.and.resolveTo({ id: '123' });
    const response = await verifyMagicLink(
      { method: 'GET' } as Request,
      { params: { token: magicLinkToken, redirectEnv: 'dev' } } as unknown as Context,
      dbManager as unknown as MongoDbManager
    );
    expect(response.status).toEqual(301);
  });

  it('should return not found error if user is not found', async () => {
    const { magicLinkToken } = await getLoginCode('123');
    collection.findOne.and.resolveTo(null);
    const response = await verifyMagicLink(
      { method: 'GET' } as Request,
      { params: { token: magicLinkToken, redirectEnv: 'dev' } } as unknown as Context,
      dbManager as unknown as MongoDbManager
    );
    expect(response.status).toEqual(404);
  });

  it('should return unauthorized error for invalid magic link', async () => {
    collection.findOne.and.resolveTo({ id: '123' });
    const response = await verifyMagicLink(
      { method: 'GET' } as Request,
      { params: { token: 'magicLinkToken', redirectEnv: 'dev' } } as unknown as Context,
      dbManager as unknown as MongoDbManager
    );
    expect(response.status).toEqual(401);
    const data = await response.json();
    expect(data.error).toContain(ApiError.INVALID_MAGIC_LINK);
  });

  ['POST', 'PUT', 'DELETE', 'PATCH'].forEach(method => {
    it(`should not allow ${method} requests`, async () => {
      const response = await verifyMagicLink(
        { method } as Request,
        { params: { token: 'magicLinkToken', redirectEnv: 'dev' } } as unknown as Context,
        dbManager as unknown as MongoDbManager
      );
      expect(response.status).toEqual(405);
    });
  });

  [
    { token: null, redirectEnv: 'prod' },
    { redirectEnv: 'prod' },
    { token: 'SomeLongTokenStringHereButNoEnv' },
    { token: 'SomeLongTokenStringHEre', redirectEnv: 'asd' },
  ].forEach(params => {
    it(`should return bad request error for invalid request params: ${JSON.stringify(params)}`, async () => {
      const response = await verifyMagicLink(
        { method: 'GET' } as Request,
        { params } as unknown as Context,
        dbManager as unknown as MongoDbManager
      );
      expect(response.status).toEqual(400);
    });
  });
});
