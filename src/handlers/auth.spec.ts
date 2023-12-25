import { MockCollection, MockDb } from '../mock/db.js';
import { requestLoginCode } from './auth.js';
import { Context } from '@netlify/functions';
import { Db } from 'mongodb';

describe('Auth handler', () => {
  let db: MockDb;
  let collection: MockCollection;
  let sendLoginCodeSpy: jasmine.Spy;
  let sendSignupNotificationSpy: jasmine.Spy;

  beforeEach(() => {
    db = new MockDb();
    collection = new MockCollection();
    db.collection.and.returnValue(collection);
  });

  xdescribe('requestLoginCode', () => {
    // TODO XX
    let email: any;

    beforeEach(() => {
      sendLoginCodeSpy = spyOn(email, 'sendLoginCode');
      sendSignupNotificationSpy = spyOn(email, 'sendSignupNotification');
      collection.findOne.and.returnValue(null);
      collection.insertOne.and.returnValue(true);
      // sendSignupNotificationSpy.and.resolveTo(true);
      // sendLoginCodeSpy.and.returnValue(true);
    });
    it('should', async () => {
      const request = new Request('http://localhost:8888', {
        method: 'POST',
        body: JSON.stringify({ email: 'kinpeter85@gmail.com' }),
      });
      // const response = await requestLoginCode(request, {} as Context, db as unknown as Db);
      expect(sendSignupNotificationSpy).toHaveBeenCalled();
      expect(sendLoginCodeSpy).toHaveBeenCalled();
    });
  });
});
