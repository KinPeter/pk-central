import { jest } from '@jest/globals';

const mockImplementation = () => Promise.resolve();

export class MockHttpClient {
  setHeaders = jest.fn<() => void>();
  get = jest.fn<() => Promise<any>>(mockImplementation);
  post = jest.fn<() => Promise<any>>(mockImplementation);
  put = jest.fn<() => Promise<any>>(mockImplementation);
  patch = jest.fn<() => Promise<any>>(mockImplementation);
  delete = jest.fn<() => Promise<any>>(mockImplementation);
}
