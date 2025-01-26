import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { assertToHaveNecessaryKeys, assertUnauthorized, getHeaders, getInvalidHeaders } from '../test-utils/acc-utils';
import { uuidV4Regex } from '../test-utils/constants';
import { sharedSettings, validSettingsRequest } from '../test-utils/test-data/start-settings';

export async function startSettingsTests(API_URL: string): Promise<void> {
  return await describe('Start settings', async () => {
    const keys = ['id', ...Object.keys(validSettingsRequest)];

    await it('should get the initial settings', async () => {
      const res = await fetch(`${API_URL}/start-settings`, {
        method: 'GET',
        headers: getHeaders(),
      });
      const json: any = await res.json();
      assert.strictEqual(res.status, 200);
      assertToHaveNecessaryKeys(json, { ...validSettingsRequest, ...sharedSettings });
      keys.forEach(key => {
        if (key === 'id') {
          assert.match(json[key], uuidV4Regex);
        } else {
          assert.strictEqual(json[key], null);
        }
      });
      assert.strictEqual(json.stravaClientId, 'stravaClientId');
    });

    await it('should update the settings', async () => {
      const res = await fetch(`${API_URL}/start-settings`, {
        method: 'PUT',
        body: JSON.stringify(validSettingsRequest),
        headers: getHeaders(),
      });
      const json: any = await res.json();
      assert.strictEqual(res.status, 200);
      assertToHaveNecessaryKeys(json, { ...validSettingsRequest, ...sharedSettings });
      assert.match(json.id, uuidV4Regex);
      keys.forEach(key => {
        if (key !== 'id') {
          assert.strictEqual(json[key], validSettingsRequest[key as keyof typeof validSettingsRequest]);
        }
      });
    });

    await it('should get the updated settings', async () => {
      const res = await fetch(`${API_URL}/start-settings`, {
        method: 'GET',
        headers: getHeaders(),
      });
      const json: any = await res.json();
      assert.strictEqual(res.status, 200);
      assertToHaveNecessaryKeys(json, { ...validSettingsRequest, ...sharedSettings });
      assert.match(json.id, uuidV4Regex);
      keys.forEach(key => {
        if (key !== 'id') {
          assert.strictEqual(json[key], validSettingsRequest[key as keyof typeof validSettingsRequest]);
        }
      });
    });

    const requests = [
      ['GET', '/start-settings', undefined],
      ['PUT', '/start-settings', validSettingsRequest],
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
