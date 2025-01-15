import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { authRequest, updatedAuthRequest, userEmail } from '../test-utils/test-data/auth';
import { uuidV4Regex } from '../test-utils/constants';
import { assertUnauthorized, getHeaders, getInvalidHeaders } from '../test-utils/acc-utils';

export async function authTests(API_URL: string): Promise<void> {
  return await describe('Auth', async () => {
    await it('should sign a user up', async () => {
      const res = await fetch(`${API_URL}/auth/password-signup`, {
        method: 'POST',
        body: JSON.stringify(authRequest),
      });
      const json: any = await res.json();
      assert.strictEqual(res.status, 201);
      assert.deepStrictEqual(Object.keys(json), ['id']);
      assert.match(json.id, uuidV4Regex);
      process.env.USER_ID = json.id;
    });

    await it('should log in with a password', async () => {
      const res = await fetch(`${API_URL}/auth/password-login`, {
        method: 'POST',
        body: JSON.stringify(authRequest),
      });
      const json: any = await res.json();

      assert.strictEqual(res.status, 200);
      assert.deepStrictEqual(Object.keys(json), ['id', 'email', 'token', 'expiresAt']);
      assert.match(json.id, uuidV4Regex);
      assert.strictEqual(json.email, authRequest.email);
      assert(json.token, 'token should be defined');
      assert(json.token !== null, 'token should not be null');
      process.env.TOKEN = json.token;
    });

    await it('should update the password', async () => {
      const res = await fetch(`${API_URL}/auth/set-password`, {
        method: 'PUT',
        body: JSON.stringify(updatedAuthRequest),
        headers: getHeaders(),
      });
      const json: any = await res.json();

      assert.strictEqual(res.status, 201);
      assert.deepStrictEqual(Object.keys(json), ['id']);
      assert.strictEqual(json.id, process.env.USER_ID);
    });

    await it('should log in with the new password', async () => {
      const res = await fetch(`${API_URL}/auth/password-login`, {
        method: 'POST',
        body: JSON.stringify(updatedAuthRequest),
      });
      const json: any = await res.json();

      assert.strictEqual(res.status, 200);
      assert.deepStrictEqual(Object.keys(json), ['id', 'email', 'token', 'expiresAt']);
      assert.strictEqual(json.id, process.env.USER_ID);
      assert.strictEqual(json.email, authRequest.email);
      assert(json.token, 'token should be defined');
      assert(json.token !== null, 'token should not be null');
      process.env.TOKEN = json.token;
    });

    await it('should send login code email', async () => {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        body: JSON.stringify({ email: userEmail }),
      });
      const json: any = await res.json();

      assert.strictEqual(res.status, 200);
      assert.deepStrictEqual(Object.keys(json), ['message']);
      assert.strictEqual(json.message, 'Check your inbox');
    });

    await it('should refresh the token', async () => {
      const res = await fetch(`${API_URL}/auth/token-refresh`, {
        method: 'POST',
        body: JSON.stringify({ email: userEmail }),
        headers: getHeaders(),
      });
      const json: any = await res.json();

      assert.strictEqual(res.status, 200);
      assert.deepStrictEqual(Object.keys(json), ['id', 'email', 'token', 'expiresAt']);
      assert.strictEqual(json.id, process.env.USER_ID);
      assert.strictEqual(json.email, authRequest.email);
      assert(json.token, 'token should be defined');
      assert(json.token !== null, 'token should not be null');
    });

    await it('should get unauthorized for refresh token without token', async () => {
      const res = await fetch(`${API_URL}/auth/token-refresh`, {
        method: 'POST',
        body: JSON.stringify({ email: userEmail }),
        headers: getInvalidHeaders(),
      });
      await assertUnauthorized(res);
    });
  });
}
