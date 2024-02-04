import { jest } from '@jest/globals';

export class MockEmailManager {
  sendLoginCode = jest.fn<() => Promise<any>>();
  sendSignupNotification = jest.fn<() => Promise<any>>();
  sendDataBackup = jest.fn<() => Promise<any>>();
}
