import { ApiError } from '../common';
import assert from 'node:assert/strict';

export function getHeaders() {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${process.env.TOKEN}`,
  };
}

export function getInvalidHeaders() {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer some-invalid-token`,
  };
}

export async function assertUnauthorized(res: Response): Promise<void> {
  const json: any = await res.json();
  assert.strictEqual(res.status, 401);
  assert.strictEqual(json.error, ApiError.INVALID_AUTH_TOKEN);
}

export function assertToHaveNecessaryKeys(received: object, expected: object): void {
  const set1 = new Set(Object.keys(received));
  const set2 = new Set(Object.keys(expected));
  const difference = set1.symmetricDifference(set2);
  // const difference = new Set([...set1].filter(x => !set2.has(x)).concat([...set2].filter(x => !set1.has(x))));
  const condition =
    difference.size === 0 ||
    (difference.size === 1 && difference.has('id')) ||
    (difference.size === 1 && difference.has('userId')) ||
    (difference.size === 1 && difference.has('createdAt')) ||
    (difference.size === 2 && difference.has('id') && difference.has('createdAt')) ||
    (difference.size === 2 && difference.has('userId') && difference.has('createdAt')) ||
    (difference.size === 2 && difference.has('id') && difference.has('userId')) ||
    (difference.size === 3 && difference.has('id') && difference.has('userId') && difference.has('createdAt'));
  if (!condition) {
    console.warn('Difference:', difference);
  }
  assert(condition, 'Object keys do not match');
}
