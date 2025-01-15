import { expect, it, describe } from '@jest/globals';
import { expectToHaveNecessaryKeys, runSequentially } from '../test-utils/acc-utils';
import { validFlightRequests } from '../test-utils/test-data/flights';
import { validVisitRequests } from '../test-utils/test-data/visits';

export async function publicTests(API_URL: string) {
  describe('Public', () => {
    const endpoint = '/public';

    it(
      'should all visits and flights without authentication',
      runSequentially(async () => {
        const res = await fetch(`${API_URL}${endpoint}/trips/${process.env.USER_ID}`, {
          method: 'GET',
        });
        const json: any = await res.json();
        expect(res.status).toBe(200);
        expect(Object.keys(json)).toEqual(['flights', 'visits']);
        expect(json.flights.length).toEqual(1);
        expect(json.visits.length).toEqual(1);
        expectToHaveNecessaryKeys(json.visits[0], validVisitRequests[0]);
        expectToHaveNecessaryKeys(json.flights[0], validFlightRequests[0]);
      })
    );
  });
}
