import { jest } from '@jest/globals';

export class MockHttpClient {
  setHeaders = jest.fn<() => void>();
  get = jest.fn<() => Promise<any>>();
  post = jest.fn<() => Promise<any>>();
  put = jest.fn<() => Promise<any>>();
  patch = jest.fn<() => Promise<any>>();
  delete = jest.fn<() => Promise<any>>();
}
