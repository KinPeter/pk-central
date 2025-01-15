import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { assertToHaveNecessaryKeys, assertUnauthorized, getHeaders, getInvalidHeaders } from '../test-utils/acc-utils';
import { randomUUID, uuidV4Regex } from '../test-utils/constants';
import { validPersonalDataRequests } from 'test-utils/test-data/personal-data';

export async function personalDataTests(API_URL: string): Promise<void> {
  return await describe('Personal Data', async () => {
    const endpoint = '/personal-data';
    let itemId: string;
    const keys = Object.keys(validPersonalDataRequests[0]).filter(key => key !== 'userId');

    await it('should create a personal data', async () => {
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        body: JSON.stringify(validPersonalDataRequests[0]),
        headers: getHeaders(),
      });
      const json: any = await res.json();
      assert.strictEqual(res.status, 201);
      assertToHaveNecessaryKeys(json, validPersonalDataRequests[0]);
      assert.match(json.id, uuidV4Regex);
      itemId = json.id;
      keys.forEach(key => {
        assert.deepEqual(json[key], validPersonalDataRequests[0][key as keyof (typeof validPersonalDataRequests)[0]]);
      });
    });

    await it('should update a personal data', async () => {
      const res = await fetch(`${API_URL}${endpoint}/${itemId}`, {
        method: 'PUT',
        body: JSON.stringify({ ...validPersonalDataRequests[0], expiry: null }),
        headers: getHeaders(),
      });
      const json: any = await res.json();
      assert.strictEqual(res.status, 200);
      assertToHaveNecessaryKeys(json, validPersonalDataRequests[0]);
      assert.match(json.id, uuidV4Regex);
      itemId = json.id;
      keys.forEach(key => {
        if (key !== 'expiry') {
          assert.deepEqual(json[key], validPersonalDataRequests[0][key as keyof (typeof validPersonalDataRequests)[0]]);
        } else {
          assert.strictEqual(json[key], null);
        }
      });
    });

    await it('should create a new and get all personal data', async () => {
      const createRes = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        body: JSON.stringify(validPersonalDataRequests[1]),
        headers: getHeaders(),
      });
      assert.strictEqual(createRes.status, 201);

      const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'GET',
        headers: getHeaders(),
      });
      const json: any = await res.json();
      assert.strictEqual(res.status, 200);
      assert.strictEqual(json.length, 2);
      assertToHaveNecessaryKeys(json[0], validPersonalDataRequests[0]);
      assertToHaveNecessaryKeys(json[1], validPersonalDataRequests[0]);
    });

    await it('should delete a personal data', async () => {
      const deleteRes = await fetch(`${API_URL}${endpoint}/${itemId}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      assert.strictEqual(deleteRes.status, 200);

      const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'GET',
        headers: getHeaders(),
      });
      const json: any = await res.json();
      assert.strictEqual(res.status, 200);
      assert.strictEqual(json.length, 1);
      assertToHaveNecessaryKeys(json[0], validPersonalDataRequests[0]);
      assert.notStrictEqual(json[0].id, itemId);
    });

    const requests = [
      ['GET', endpoint, undefined],
      ['POST', endpoint, validPersonalDataRequests[0]],
      ['PUT', `${endpoint}/${randomUUID}`, validPersonalDataRequests[0]],
      ['DELETE', `${endpoint}/${randomUUID}`, undefined],
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
