import { expect, it, describe } from '@jest/globals';
import { expectToHaveNecessaryKeys, getHeaders, runSequentially } from '../test-utils/acc-utils';
import { airlineResponse, airportResponse, cityResponse } from '../test-utils/test-data/proxy';

export async function proxyTests(API_URL: string) {
  describe('Proxy', () => {
    const endpoint = '/proxy';

    it(
      'should fetch airline information',
      runSequentially(async () => {
        const res = await fetch(`${API_URL}${endpoint}/airline/AA`, {
          method: 'GET',
          headers: getHeaders(),
        });
        const json: any = await res.json();
        expect(res.status).toBe(200);
        expectToHaveNecessaryKeys(json, airlineResponse);
        expect(json.name).toEqual('American Airlines');
      })
    );

    it(
      'should fetch airport information',
      runSequentially(async () => {
        const res = await fetch(`${API_URL}${endpoint}/airport/JFK`, {
          method: 'GET',
          headers: getHeaders(),
        });
        const json: any = await res.json();
        expect(res.status).toBe(200);
        expectToHaveNecessaryKeys(json, airportResponse);
        expect(json.name).toEqual('John F. Kennedy International Airport');
        expect(json.city).toEqual('New York');
      })
    );

    it(
      'should fetch city information for coords',
      runSequentially(async () => {
        const res = await fetch(`${API_URL}${endpoint}/city/40.712,-70.006`, {
          method: 'GET',
          headers: getHeaders(),
        });
        const json: any = await res.json();
        expect(res.status).toBe(200);
        expectToHaveNecessaryKeys(json, cityResponse);
        expect(json.city).toEqual('New York');
      })
    );

    it(
      'should fetch fetch the birthdays sheet',
      runSequentially(async () => {
        const res = await fetch(`${API_URL}${endpoint}/birthdays`, {
          method: 'GET',
          headers: getHeaders(),
        });
        const json: any = await res.json();
        expect(res.status).toBe(200);
        expect(json.length).toEqual(2);
        expect(json[0].name).toContain('Santa Claus');
      })
    );
  });
}
