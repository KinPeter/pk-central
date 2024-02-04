import { jest } from '@jest/globals';

export class MockAuthManager {
  authenticateUser = jest.fn<() => Promise<any>>();
}
