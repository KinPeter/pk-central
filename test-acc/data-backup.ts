import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { assertUnauthorized, getHeaders, getInvalidHeaders } from '../test-utils/acc-utils';

export async function dataBackupTests(API_URL: string): Promise<void> {
  return await describe('Data backup', async () => {
    const endpoint = '/data-backup';

    await it('should send an email with data backup', async () => {
      const res = await fetch(`${API_URL}${endpoint}/email`, {
        method: 'GET',
        headers: getHeaders(),
      });
      const json: any = await res.json();
      assert.strictEqual(res.status, 200);
      assert.strictEqual(json.message, 'Check your inbox');
    });

    await it('should send data backup in response', async () => {
      const res = await fetch(`${API_URL}${endpoint}/data`, {
        method: 'GET',
        headers: getHeaders(),
      });
      const json: any = await res.json();
      assert.strictEqual(res.status, 200);
      assert.deepStrictEqual(Object.keys(json), [
        'user',
        'startSettings',
        'activities',
        'cycling',
        'flights',
        'notes',
        'personalData',
        'shortcuts',
        'visits',
      ]);
      assert.strictEqual(json.flights.length, 1);
      assert.strictEqual(json.visits.length, 1);
      assert.strictEqual(json.notes.length, 1);
      assert.strictEqual(json.personalData.length, 1);
      assert.strictEqual(json.shortcuts.length, 1);
    });

    const requests = [
      ['GET', `${endpoint}/email`, undefined],
      ['GET', `${endpoint}/data`, undefined],
    ];
    for (const [method, path, body] of requests) {
      await it(`should get unauthorized for requests without token (${method} ${path})`, async () => {
        const res = await fetch(`${API_URL}${path}`, {
          method: method as string,
          body: body ? JSON.stringify(body) : undefined,
          headers: getInvalidHeaders(),
        });
        await assertUnauthorized(res);
      });
    }
  });
}
