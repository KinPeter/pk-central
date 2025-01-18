import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { assertToHaveNecessaryKeys, assertUnauthorized, getHeaders, getInvalidHeaders } from '../test-utils/acc-utils';
import { randomUUID, uuidV4Regex } from '../test-utils/constants';
import { validVisitRequests } from '../test-utils/test-data/visits';

export async function visitsTests(API_URL: string): Promise<void> {
  return await describe('Visits', async () => {
    const endpoint = '/visits';
    let itemId: string;
    const keys = Object.keys(validVisitRequests[0]).filter(key => key !== 'userId');

    await it('should create a visit', async () => {
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        body: JSON.stringify(validVisitRequests[0]),
        headers: getHeaders(),
      });
      const json: any = await res.json();
      assert.strictEqual(res.status, 201);
      assertToHaveNecessaryKeys(json, validVisitRequests[0]);
      assert.match(json.id, uuidV4Regex);
      itemId = json.id;
      keys.forEach(key => {
        assert.deepEqual(json[key], validVisitRequests[0][key as keyof (typeof validVisitRequests)[0]]);
      });
    });

    await it('should update a visit', async () => {
      const res = await fetch(`${API_URL}${endpoint}/${itemId}`, {
        method: 'PUT',
        body: JSON.stringify({ ...validVisitRequests[0], year: 2024 }),
        headers: getHeaders(),
      });
      const json: any = await res.json();
      assert.strictEqual(res.status, 200);
      assertToHaveNecessaryKeys(json, validVisitRequests[0]);
      assert.match(json.id, uuidV4Regex);
      itemId = json.id;
      keys.forEach(key => {
        if (key !== 'year') {
          assert.deepEqual(json[key], validVisitRequests[0][key as keyof (typeof validVisitRequests)[0]]);
        } else {
          assert.strictEqual(json[key], 2024);
        }
      });
    });

    await it('should create a new and get all visits', async () => {
      const createRes = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        body: JSON.stringify(validVisitRequests[1]),
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
      assertToHaveNecessaryKeys(json[0], validVisitRequests[0]);
      assertToHaveNecessaryKeys(json[1], validVisitRequests[0]);
    });

    await it('should delete a visit', async () => {
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
      assertToHaveNecessaryKeys(json[0], validVisitRequests[0]);
      assert.notStrictEqual(json[0].id, itemId);
    });

    const requests = [
      ['GET', endpoint, undefined],
      ['POST', endpoint, validVisitRequests[0]],
      ['PUT', `${endpoint}/${randomUUID}`, validVisitRequests[0]],
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
