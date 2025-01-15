import { expect, it, describe } from '@jest/globals';
import { uuidV4Regex } from '../test-utils/constants';
import {
  expectToHaveNecessaryKeys,
  expectUnauthorized,
  getHeaders,
  getInvalidHeaders,
  runSequentially,
} from '../test-utils/acc-utils';
import { validSettingsRequest } from '../test-utils/test-data/start-settings';

export async function startSettingTests(API_URL: string) {
  describe('Start settings', () => {
    const keys = ['id', ...Object.keys(validSettingsRequest)];

    it(
      'should get the initial settings',
      runSequentially(async () => {
        const res = await fetch(`${API_URL}/start-settings`, {
          method: 'GET',
          headers: getHeaders(),
        });
        const json: any = await res.json();
        expect(res.status).toBe(200);
        // expect(Object.keys(json)).toEqual(keys);
        expectToHaveNecessaryKeys(json, validSettingsRequest);
        keys.forEach(key => {
          if (key === 'id') {
            expect(json[key]).toMatch(uuidV4Regex);
          } else {
            expect(json[key]).toBeNull();
          }
        });
      })
    );

    it(
      'should update the settings',
      runSequentially(async () => {
        const res = await fetch(`${API_URL}/start-settings`, {
          method: 'PUT',
          body: JSON.stringify(validSettingsRequest),
          headers: getHeaders(),
        });
        const json: any = await res.json();
        expect(res.status).toBe(200);
        expectToHaveNecessaryKeys(json, validSettingsRequest);
        expect(json.id).toMatch(uuidV4Regex);
        keys.forEach(key => {
          if (key !== 'id') {
            expect(json[key]).toBe(validSettingsRequest[key as keyof typeof validSettingsRequest]);
          }
        });
      })
    );

    it(
      'should get the updated settings',
      runSequentially(async () => {
        const res = await fetch(`${API_URL}/start-settings`, {
          method: 'GET',
          headers: getHeaders(),
        });
        const json: any = await res.json();
        expect(res.status).toBe(200);
        expectToHaveNecessaryKeys(json, validSettingsRequest);
        expect(json.id).toMatch(uuidV4Regex);
        keys.forEach(key => {
          if (key !== 'id') {
            expect(json[key]).toBe(validSettingsRequest[key as keyof typeof validSettingsRequest]);
          }
        });
      })
    );

    it.each([
      ['GET', '/start-settings', undefined],
      ['PUT', '/start-settings', validSettingsRequest],
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
