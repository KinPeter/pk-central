import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { assertToHaveNecessaryKeys, getHeaders } from '../test-utils/acc-utils';
import { airlineResponse, airportResponse, cityResponse } from '../test-utils/test-data/proxy';

export async function proxyTests(API_URL: string): Promise<void> {
  return await describe('Proxy', async () => {
    const endpoint = '/proxy';

    await it('should fetch airline information', async () => {
      const res = await fetch(`${API_URL}${endpoint}/airline/AA`, {
        method: 'GET',
        headers: getHeaders(),
      });
      const json: any = await res.json();
      assert.strictEqual(res.status, 200);
      assertToHaveNecessaryKeys(json, airlineResponse);
      assert.strictEqual(json.name, 'American Airlines');
    });

    await it('should fetch airport information', async () => {
      const res = await fetch(`${API_URL}${endpoint}/airport/JFK`, {
        method: 'GET',
        headers: getHeaders(),
      });
      const json: any = await res.json();
      assert.strictEqual(res.status, 200);
      assertToHaveNecessaryKeys(json, airportResponse);
      assert.strictEqual(json.name, 'John F. Kennedy International Airport');
      assert.strictEqual(json.city, 'New York');
    });

    await it('should fetch city information for coords', async () => {
      const res = await fetch(`${API_URL}${endpoint}/city/40.712,-70.006`, {
        method: 'GET',
        headers: getHeaders(),
      });
      const json: any = await res.json();
      assert.strictEqual(res.status, 200);
      assertToHaveNecessaryKeys(json, cityResponse);
      assert.strictEqual(json.city, 'New York');
    });

    await it('should fetch the birthdays sheet', async () => {
      const res = await fetch(`${API_URL}${endpoint}/birthdays`, {
        method: 'GET',
        headers: getHeaders(),
      });
      const json: any = await res.json();
      assert.strictEqual(res.status, 200);
      assert.strictEqual(json.length, 2);
      assert(json[0].name.includes('Santa Claus'), 'Name should include Santa Claus');
    });
  });
}
