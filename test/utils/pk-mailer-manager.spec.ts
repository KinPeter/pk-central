import { describe, it, expect, beforeEach } from '@jest/globals';
import { DataBackup } from '../../common';
import { PkMailerManager } from '../../src/utils/pk-mailer-manager';
import { HttpClient } from '../../src/utils/http-client';
import { MockHttpClient } from '../../test-utils/mock/http-client.mock';

describe('PkMailerManager', () => {
  let httpClient: MockHttpClient;
  let emailManager: PkMailerManager;
  const mockApiKey = 'apiKey';
  const mockUrl = 'http://localhost:8888';

  beforeEach(() => {
    process.env.NOTIFICATION_EMAIL = 'test@test.com';
    process.env.MAILER_URL = mockUrl;
    process.env.MAILER_API_KEY = mockApiKey;
    httpClient = new MockHttpClient();
    emailManager = new PkMailerManager(httpClient as unknown as HttpClient);
  });

  it('should call pk-mailer API when sending a login code email', () => {
    emailManager.sendLoginCode('test@test.com', '123123', 'token');
    expect(httpClient.post).toHaveBeenCalled();
    const [path, body] = httpClient.post.mock.lastCall as Array<any>;
    expect(path).toEqual(mockUrl);
    expect(body.apiKey).toEqual(mockApiKey);
    expect(body.to).toEqual('test@test.com');
  });

  it('should call pk-mailer API when sending a notification email', () => {
    emailManager.sendSignupNotification('test@test.com');
    expect(httpClient.post).toHaveBeenCalled();
    const [path, body] = httpClient.post.mock.lastCall as Array<any>;
    expect(path).toEqual(mockUrl);
    expect(body.apiKey).toEqual(mockApiKey);
    expect(body.to).toEqual('test@test.com');
  });

  it('should call pk-mailer API when sending a data backup email', () => {
    emailManager.sendDataBackup('name', 'test@test.com', {} as DataBackup);
    expect(httpClient.post).toHaveBeenCalled();
    const [path, body] = httpClient.post.mock.lastCall as Array<any>;
    expect(path).toEqual(mockUrl);
    expect(body.apiKey).toEqual(mockApiKey);
    expect(body.to).toEqual('test@test.com');
  });
});
