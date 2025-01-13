import { expect, it, describe } from '@jest/globals';
import { uuidV4Regex } from '../test-utils/constants';
import { authRequest } from '../test-utils/test-data/auth';

export async function authTests(API_URL: string) {
  describe('Auth', () => {
    it('should sign a new user up', async () => {
      const res = await fetch(`${API_URL}/auth/password-signup`, {
        method: 'POST',
        body: JSON.stringify(authRequest),
      });
      const json = await res.json();
      expect(res.status).toBe(201);
      expect(Object.keys(json)).toEqual(['id']);
      expect(json.id).toMatch(uuidV4Regex);
    });
  });
}
