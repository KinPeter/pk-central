import { expect, it, describe } from '@jest/globals';
import { uuidV4Regex } from '../test-utils/constants';
import { getHeaders, runSequentially } from '../test-utils/acc-utils';
import { authRequest, updatedAuthRequest } from '../test-utils/test-data/auth';

export async function authTests(API_URL: string) {
  describe('Auth', () => {
    it(
      'should sign a new user up',
      runSequentially(async () => {
        const res = await fetch(`${API_URL}/auth/password-signup`, {
          method: 'POST',
          body: JSON.stringify(authRequest),
        });
        const json = await res.json();
        expect(res.status).toBe(201);
        expect(Object.keys(json)).toEqual(['id']);
        expect(json.id).toMatch(uuidV4Regex);
        process.env.USER_ID = json.id;
      })
    );

    it(
      'should log in with password',
      runSequentially(async () => {
        const res = await fetch(`${API_URL}/auth/password-login`, {
          method: 'POST',
          body: JSON.stringify(authRequest),
        });
        const json = await res.json();
        expect(res.status).toBe(200);
        expect(Object.keys(json)).toEqual(['id', 'email', 'token', 'expiresAt']);
        expect(json.id).toMatch(uuidV4Regex);
        expect(json.email).toBe(authRequest.email);
        expect(json.token).toBeDefined();
        expect(json.token).not.toBeNull();
        process.env.TOKEN = json.token;
      })
    );

    it(
      'should update the password',
      runSequentially(async () => {
        const res = await fetch(`${API_URL}/auth/set-password`, {
          method: 'PUT',
          body: JSON.stringify(updatedAuthRequest),
          headers: getHeaders(),
        });
        const json = await res.json();
        expect(res.status).toBe(201);
        expect(Object.keys(json)).toEqual(['id']);
        expect(json.id).toBe(process.env.USER_ID);
      })
    );

    it(
      'should log in with the new password',
      runSequentially(async () => {
        const res = await fetch(`${API_URL}/auth/password-login`, {
          method: 'POST',
          body: JSON.stringify(updatedAuthRequest),
        });
        const json = await res.json();
        expect(res.status).toBe(200);
        expect(Object.keys(json)).toEqual(['id', 'email', 'token', 'expiresAt']);
        expect(json.id).toBe(process.env.USER_ID);
        expect(json.email).toBe(authRequest.email);
        expect(json.token).toBeDefined();
        expect(json.token).not.toBeNull();
        process.env.TOKEN = json.token;
      })
    );
  });
}
