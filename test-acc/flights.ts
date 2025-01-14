import { expect, it, describe } from '@jest/globals';
import { uuidV4Regex } from '../test-utils/constants';
import { expectUnauthorized, getHeaders, getInvalidHeaders, runSequentially } from '../test-utils/acc-utils';
import { validFlightRequests } from '../test-utils/test-data/flights';

export async function flightsTests(API_URL: string) {
  describe('Flights', () => {
    const endpoint = '/flights';
    let itemId: string;
    const keys = Object.keys(validFlightRequests[0]).filter(key => key !== 'userId');

    it(
      'should create a flight',
      runSequentially(async () => {
        const res = await fetch(`${API_URL}${endpoint}`, {
          method: 'POST',
          body: JSON.stringify(validFlightRequests[0]),
          headers: getHeaders(),
        });
        const json = await res.json();
        expect(res.status).toBe(201);
        // expect(Object.keys(json)).toEqual(keys); // TODO use new set method to write util to compare keys
        expect(json.id).toMatch(uuidV4Regex);
        itemId = json.id;
      })
    );

    it.each([
      ['GET', endpoint, undefined],
      ['POST', endpoint, validFlightRequests[0]],
      ['PUT', endpoint, validFlightRequests[0]],
      ['DELETE', endpoint, undefined],
    ])('should get unauthorized for %s %s request without token', (method, path, body) => {
      runSequentially(async () => {
        const res = await fetch(`${API_URL}${path}`, {
          method,
          body: body ? JSON.stringify(body) : undefined,
          headers: getInvalidHeaders(),
        });
        await expectUnauthorized(res);
      });
    });
  });
}
