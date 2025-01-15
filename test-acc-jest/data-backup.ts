import { expect, it, describe } from '@jest/globals';
import { expectUnauthorized, getHeaders, getInvalidHeaders, runSequentially } from '../test-utils/acc-utils';

export async function dataBackupTests(API_URL: string) {
  describe('Data backup', () => {
    const endpoint = '/data-backup';

    it(
      'should send an email with data backup',
      runSequentially(async () => {
        const res = await fetch(`${API_URL}${endpoint}/email`, {
          method: 'GET',
          headers: getHeaders(),
        });
        const json: any = await res.json();
        expect(res.status).toBe(200);
        expect(json.message).toEqual('Check your inbox');
      })
    );

    it(
      'should send data backup in response',
      runSequentially(async () => {
        const res = await fetch(`${API_URL}${endpoint}/data`, {
          method: 'GET',
          headers: getHeaders(),
        });
        const json: any = await res.json();
        expect(res.status).toBe(200);
        expect(Object.keys(json)).toEqual([
          'user',
          'startSettings',
          'activities',
          'cycling',
          'flights',
          'notes',
          'personalData',
          'shortcuts',
          'visits',
        ]);
        expect(json.flights.length).toEqual(1);
        expect(json.visits.length).toEqual(1);
        expect(json.notes.length).toEqual(1);
        expect(json.personalData.length).toEqual(1);
        expect(json.shortcuts.length).toEqual(1);
      })
    );

    it.each([
      ['GET', `${endpoint}/email`, undefined],
      ['GET', `${endpoint}/data`, undefined],
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
