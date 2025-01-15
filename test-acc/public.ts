import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { assertToHaveNecessaryKeys } from '../test-utils/acc-utils';
import { validFlightRequests } from '../test-utils/test-data/flights';
import { validVisitRequests } from '../test-utils/test-data/visits';

export async function publicTests(API_URL: string): Promise<void> {
  return await describe('Public', async () => {
    const endpoint = '/public';

    await it('should get all visits and flights without authentication', async () => {
      const res = await fetch(`${API_URL}${endpoint}/trips/${process.env.USER_ID}`, {
        method: 'GET',
      });
      const json: any = await res.json();
      assert.strictEqual(res.status, 200);
      assert.deepStrictEqual(Object.keys(json), ['flights', 'visits']);
      assert.strictEqual(json.flights.length, 1);
      assert.strictEqual(json.visits.length, 1);
      assertToHaveNecessaryKeys(json.visits[0], validVisitRequests[0]);
      assertToHaveNecessaryKeys(json.flights[0], validFlightRequests[0]);
    });
  });
}
