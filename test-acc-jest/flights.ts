import { expect, it, describe } from '@jest/globals';
import { uuidV4Regex } from '../test-utils/constants';
import {
  expectToHaveNecessaryKeys,
  expectUnauthorized,
  getHeaders,
  getInvalidHeaders,
  runSequentially,
} from '../test-utils/acc-utils';
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
        const json: any = await res.json();
        expect(res.status).toBe(201);
        expectToHaveNecessaryKeys(json, validFlightRequests[0]);
        expect(json.id).toMatch(uuidV4Regex);
        itemId = json.id;
        keys.forEach(key => {
          expect(json[key]).toEqual(validFlightRequests[0][key as keyof (typeof validFlightRequests)[0]]);
        });
      })
    );

    it(
      'should update a flight',
      runSequentially(async () => {
        const res = await fetch(`${API_URL}${endpoint}/${itemId}`, {
          method: 'PUT',
          body: JSON.stringify({ ...validFlightRequests[0], isPlanned: true }),
          headers: getHeaders(),
        });
        const json: any = await res.json();
        expect(res.status).toBe(200);
        expectToHaveNecessaryKeys(json, validFlightRequests[0]);
        expect(json.id).toMatch(uuidV4Regex);
        itemId = json.id;
        keys.forEach(key => {
          if (key !== 'isPlanned') {
            expect(json[key]).toEqual(validFlightRequests[0][key as keyof (typeof validFlightRequests)[0]]);
          } else {
            expect(json[key]).toBe(true);
          }
        });
      })
    );

    it(
      'should create a new and get all flights',
      runSequentially(async () => {
        const createRes = await fetch(`${API_URL}${endpoint}`, {
          method: 'POST',
          body: JSON.stringify(validFlightRequests[1]),
          headers: getHeaders(),
        });
        expect(createRes.status).toBe(201);

        const res = await fetch(`${API_URL}${endpoint}`, {
          method: 'GET',
          headers: getHeaders(),
        });
        const json: any = await res.json();
        expect(res.status).toBe(200);
        expect(json.length).toEqual(2);
        expectToHaveNecessaryKeys(json[0], validFlightRequests[0]);
        expectToHaveNecessaryKeys(json[1], validFlightRequests[0]);
      })
    );

    it(
      'should delete a flight',
      runSequentially(async () => {
        const deleteRes = await fetch(`${API_URL}${endpoint}/${itemId}`, {
          method: 'DELETE',
          headers: getHeaders(),
        });
        expect(deleteRes.status).toBe(200);

        const res = await fetch(`${API_URL}${endpoint}`, {
          method: 'GET',
          headers: getHeaders(),
        });
        const json: any = await res.json();
        expect(res.status).toBe(200);
        expect(json.length).toEqual(1);
        expectToHaveNecessaryKeys(json[0], validFlightRequests[0]);
        expect(json[0].id).not.toEqual(itemId);
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
