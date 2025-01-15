import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { authRequest } from '../test-utils/test-data/auth';
import { uuidV4Regex } from '../test-utils/constants';

export async function dataBackupTests(API_URL: string): Promise<void> {
  return await describe('Data Backup', async () => {
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
  });
}
