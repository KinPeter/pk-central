import { expect, it, describe } from '@jest/globals';
import { uuidV4Regex } from '../test-utils/constants';
import {
  expectToHaveNecessaryKeys,
  expectUnauthorized,
  getHeaders,
  getInvalidHeaders,
  runSequentially,
} from '../test-utils/acc-utils';
import { validVisitRequests } from '../test-utils/test-data/visits';

export async function visitsTests(API_URL: string) {
  describe('Visits', () => {
    const endpoint = '/visits';
    let itemId: string;
    const keys = Object.keys(validVisitRequests[0]).filter(key => key !== 'userId');

    it(
      'should create a visit',
      runSequentially(async () => {
        const res = await fetch(`${API_URL}${endpoint}`, {
          method: 'POST',
          body: JSON.stringify(validVisitRequests[0]),
          headers: getHeaders(),
        });
        const json: any = await res.json();
        expect(res.status).toBe(201);
        expectToHaveNecessaryKeys(json, validVisitRequests[0]);
        expect(json.id).toMatch(uuidV4Regex);
        itemId = json.id;
        keys.forEach(key => {
          expect(json[key]).toEqual(validVisitRequests[0][key as keyof (typeof validVisitRequests)[0]]);
        });
      })
    );

    it(
      'should update a visit',
      runSequentially(async () => {
        const res = await fetch(`${API_URL}${endpoint}/${itemId}`, {
          method: 'PUT',
          body: JSON.stringify({ ...validVisitRequests[0], year: 2024 }),
          headers: getHeaders(),
        });
        const json: any = await res.json();
        expect(res.status).toBe(200);
        expectToHaveNecessaryKeys(json, validVisitRequests[0]);
        expect(json.id).toMatch(uuidV4Regex);
        itemId = json.id;
        keys.forEach(key => {
          if (key !== 'year') {
            expect(json[key]).toEqual(validVisitRequests[0][key as keyof (typeof validVisitRequests)[0]]);
          } else {
            expect(json[key]).toEqual(2024);
          }
        });
      })
    );

    it(
      'should create a new and get all visits',
      runSequentially(async () => {
        const createRes = await fetch(`${API_URL}${endpoint}`, {
          method: 'POST',
          body: JSON.stringify(validVisitRequests[1]),
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
        expectToHaveNecessaryKeys(json[0], validVisitRequests[0]);
        expectToHaveNecessaryKeys(json[1], validVisitRequests[0]);
      })
    );

    it(
      'should delete a visit',
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
        expectToHaveNecessaryKeys(json[0], validVisitRequests[0]);
        expect(json[0].id).not.toEqual(itemId);
      })
    );

    it.each([
      ['GET', endpoint, undefined],
      ['POST', endpoint, validVisitRequests[0]],
      ['PUT', endpoint, validVisitRequests[0]],
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
