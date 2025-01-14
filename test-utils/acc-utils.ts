import { expect } from '@jest/globals';
import { ApiError } from '../common';

export let testOrder = Promise.resolve();

type TestFunction = (...params: any) => Promise<void>;

export const runSequentially = (func: TestFunction) => {
  return async () => {
    await testOrder;
    testOrder = func();
    await testOrder;
  };
};

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

export async function expectUnauthorized(res: Response): Promise<void> {
  const json = await res.json();
  expect(res.status).toBe(401);
  expect(json.error).toEqual(ApiError.INVALID_AUTH_TOKEN);
}
