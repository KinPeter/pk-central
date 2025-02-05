import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { assertToHaveNecessaryKeys, assertUnauthorized, getHeaders, getInvalidHeaders } from '../test-utils/acc-utils';
import { randomUUID, uuidV4Regex } from '../test-utils/constants';
import { validFlightRequests } from '../test-utils/test-data/flights';

export async function flightsTests(API_URL: string): Promise<void> {
  return await describe('Flights', async () => {
    const endpoint = '/flights';
    let itemId: string;
    const keys = Object.keys(validFlightRequests[0]).filter(key => key !== 'userId');

    await it('should create a flight', async () => {
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        body: JSON.stringify(validFlightRequests[0]),
        headers: getHeaders(),
      });
      const json: any = await res.json();
      assert.strictEqual(res.status, 201);
      assertToHaveNecessaryKeys(json, validFlightRequests[0]);
      assert.match(json.id, uuidV4Regex);
      itemId = json.id;
      keys.forEach(key => {
        assert.deepEqual(json[key], validFlightRequests[0][key as keyof (typeof validFlightRequests)[0]]);
      });
    });

    await it('should update a flight', async () => {
      const res = await fetch(`${API_URL}${endpoint}/${itemId}`, {
        method: 'PUT',
        body: JSON.stringify({ ...validFlightRequests[0], seatNumber: '1A' }),
        headers: getHeaders(),
      });
      const json: any = await res.json();
      assert.strictEqual(res.status, 200);
      assertToHaveNecessaryKeys(json, validFlightRequests[0]);
      assert.match(json.id, uuidV4Regex);
      itemId = json.id;
      keys.forEach(key => {
        if (key !== 'seatNumber') {
          assert.deepEqual(json[key], validFlightRequests[0][key as keyof (typeof validFlightRequests)[0]]);
        } else {
          assert.strictEqual(json[key], '1A');
        }
      });
    });

    await it('should create a new and get all flights', async () => {
      const createRes = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        body: JSON.stringify(validFlightRequests[1]),
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
      assertToHaveNecessaryKeys(json[0], validFlightRequests[0]);
      assertToHaveNecessaryKeys(json[1], validFlightRequests[0]);
    });

    await it('should get only planned flights', async () => {
      const res = await fetch(`${API_URL}${endpoint}?plannedOnly=true`, {
        method: 'GET',
        headers: getHeaders(),
      });
      const json: any = await res.json();
      assert.strictEqual(res.status, 200);
      assert.strictEqual(json.length, 1);
      assertToHaveNecessaryKeys(json[0], validFlightRequests[1]);
      assert.strictEqual(json[0].isPlanned, true);
    });

    await it('should delete a flight', async () => {
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
      assertToHaveNecessaryKeys(json[0], validFlightRequests[0]);
      assert.notStrictEqual(json[0].id, itemId);
    });

    const requests = [
      ['GET', endpoint, undefined],
      ['POST', endpoint, validFlightRequests[0]],
      ['PUT', `${endpoint}/${randomUUID}`, validFlightRequests[0]],
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
