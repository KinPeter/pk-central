import { expect, it, describe } from '@jest/globals';
import { uuidV4Regex } from '../test-utils/constants';
import {
  expectToHaveNecessaryKeys,
  expectUnauthorized,
  getHeaders,
  getInvalidHeaders,
  runSequentially,
} from '../test-utils/acc-utils';
import { validPersonalDataRequests } from '../test-utils/test-data/personal-data';

export async function personalDataTests(API_URL: string) {
  describe('Personal Data', () => {
    const endpoint = '/personal-data';
    let itemId: string;
    const keys = Object.keys(validPersonalDataRequests[0]).filter(key => key !== 'userId');

    it(
      'should create a personal data',
      runSequentially(async () => {
        const res = await fetch(`${API_URL}${endpoint}`, {
          method: 'POST',
          body: JSON.stringify(validPersonalDataRequests[0]),
          headers: getHeaders(),
        });
        const json: any = await res.json();
        expect(res.status).toBe(201);
        expectToHaveNecessaryKeys(json, validPersonalDataRequests[0]);
        expect(json.id).toMatch(uuidV4Regex);
        itemId = json.id;
        keys.forEach(key => {
          expect(json[key]).toEqual(validPersonalDataRequests[0][key as keyof (typeof validPersonalDataRequests)[0]]);
        });
      })
    );

    it(
      'should update a personal data',
      runSequentially(async () => {
        const res = await fetch(`${API_URL}${endpoint}/${itemId}`, {
          method: 'PUT',
          body: JSON.stringify({ ...validPersonalDataRequests[0], expiry: null }),
          headers: getHeaders(),
        });
        const json: any = await res.json();
        expect(res.status).toBe(200);
        expectToHaveNecessaryKeys(json, validPersonalDataRequests[0]);
        expect(json.id).toMatch(uuidV4Regex);
        itemId = json.id;
        keys.forEach(key => {
          if (key !== 'expiry') {
            expect(json[key]).toEqual(validPersonalDataRequests[0][key as keyof (typeof validPersonalDataRequests)[0]]);
          } else {
            expect(json[key]).toBe(null);
          }
        });
      })
    );

    it(
      'should create a new and get all personal data',
      runSequentially(async () => {
        const createRes = await fetch(`${API_URL}${endpoint}`, {
          method: 'POST',
          body: JSON.stringify(validPersonalDataRequests[1]),
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
        expectToHaveNecessaryKeys(json[0], validPersonalDataRequests[0]);
        expectToHaveNecessaryKeys(json[1], validPersonalDataRequests[0]);
      })
    );

    it(
      'should delete a personal data',
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
        expectToHaveNecessaryKeys(json[0], validPersonalDataRequests[0]);
        expect(json[0].id).not.toEqual(itemId);
      })
    );

    it.each([
      ['GET', endpoint, undefined],
      ['POST', endpoint, validPersonalDataRequests[0]],
      ['PUT', endpoint, validPersonalDataRequests[0]],
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
