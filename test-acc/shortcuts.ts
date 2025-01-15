import { expect, it, describe } from '@jest/globals';
import { uuidV4Regex } from '../test-utils/constants';
import {
  expectToHaveNecessaryKeys,
  expectUnauthorized,
  getHeaders,
  getInvalidHeaders,
  runSequentially,
} from '../test-utils/acc-utils';
import { validShortcutRequests } from '../test-utils/test-data/shortcuts';

export async function shortcutsTests(API_URL: string) {
  describe('Shortcuts', () => {
    const endpoint = '/shortcuts';
    let itemId: string;
    const keys = Object.keys(validShortcutRequests[0]).filter(key => key !== 'userId');

    it(
      'should create a shortcut',
      runSequentially(async () => {
        const res = await fetch(`${API_URL}${endpoint}`, {
          method: 'POST',
          body: JSON.stringify(validShortcutRequests[0]),
          headers: getHeaders(),
        });
        const json: any = await res.json();
        expect(res.status).toBe(201);
        expectToHaveNecessaryKeys(json, validShortcutRequests[0]);
        expect(json.id).toMatch(uuidV4Regex);
        itemId = json.id;
        keys.forEach(key => {
          expect(json[key]).toEqual(validShortcutRequests[0][key as keyof (typeof validShortcutRequests)[0]]);
        });
      })
    );

    it(
      'should update a shortcut',
      runSequentially(async () => {
        const res = await fetch(`${API_URL}${endpoint}/${itemId}`, {
          method: 'PUT',
          body: JSON.stringify({ ...validShortcutRequests[0], priority: 2 }),
          headers: getHeaders(),
        });
        const json: any = await res.json();
        expect(res.status).toBe(200);
        expectToHaveNecessaryKeys(json, validShortcutRequests[0]);
        expect(json.id).toMatch(uuidV4Regex);
        itemId = json.id;
        keys.forEach(key => {
          if (key !== 'priority') {
            expect(json[key]).toEqual(validShortcutRequests[0][key as keyof (typeof validShortcutRequests)[0]]);
          } else {
            expect(json[key]).toEqual(2);
          }
        });
      })
    );

    it(
      'should create a new and get all shortcuts',
      runSequentially(async () => {
        const createRes = await fetch(`${API_URL}${endpoint}`, {
          method: 'POST',
          body: JSON.stringify(validShortcutRequests[1]),
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
        expectToHaveNecessaryKeys(json[0], validShortcutRequests[0]);
        expectToHaveNecessaryKeys(json[1], validShortcutRequests[0]);
      })
    );

    it(
      'should delete a shortcut',
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
        expectToHaveNecessaryKeys(json[0], validShortcutRequests[0]);
        expect(json[0].id).not.toEqual(itemId);
      })
    );

    it.each([
      ['GET', endpoint, undefined],
      ['POST', endpoint, validShortcutRequests[0]],
      ['PUT', endpoint, validShortcutRequests[0]],
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
