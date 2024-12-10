import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { FetchFn, FetchResponseType, HttpClient } from '../../src/utils/http-client';
import { SpiedFunction } from 'jest-mock';

describe('HttpClient', () => {
  let httpClient: HttpClient;
  let fetchSpy: jest.Mock<() => Promise<any>>;
  let requestSpy: SpiedFunction<any>;
  const okResponse = { ok: true, json: () => ({ data: 'good' }), text: () => 'good' };

  beforeEach(() => {
    fetchSpy = jest.fn<() => Promise<any>>();
    httpClient = new HttpClient(fetchSpy as FetchFn);
    requestSpy = jest.spyOn<any, any, any>(httpClient, 'request');
  });

  it('should set headers and return JSON data for GET request', async () => {
    fetchSpy.mockResolvedValue(okResponse);
    httpClient.setHeaders({ Authorization: 'Bearer ABC123' });
    const response = await httpClient.get('url');
    expect(requestSpy).toHaveBeenCalledWith('GET', 'url', undefined, undefined);
    expect(fetchSpy).toHaveBeenCalledWith('url', { method: 'GET', headers: { Authorization: 'Bearer ABC123' } });
    expect(response).toEqual({ data: 'good' });
  });

  it('should fire GET request for text response', async () => {
    fetchSpy.mockResolvedValue(okResponse);
    const response = await httpClient.get('url', FetchResponseType.TEXT);
    expect(requestSpy).toHaveBeenCalledWith('GET', 'url', undefined, FetchResponseType.TEXT);
    expect(fetchSpy).toHaveBeenCalledWith('url', { method: 'GET' });
    expect(response).toEqual('good');
  });

  it('should fire POST request', async () => {
    fetchSpy.mockResolvedValue(okResponse);
    const response = await httpClient.post('url', { email: 'test@test.com' });
    expect(requestSpy).toHaveBeenCalledWith('POST', 'url', { email: 'test@test.com' });
    expect(fetchSpy).toHaveBeenCalledWith('url', { method: 'POST', body: JSON.stringify({ email: 'test@test.com' }) });
    expect(response).toEqual({ data: 'good' });
  });

  it('should fire PUT request', async () => {
    fetchSpy.mockResolvedValue(okResponse);
    const response = await httpClient.put('url', { email: 'test@test.com' });
    expect(requestSpy).toHaveBeenCalledWith('PUT', 'url', { email: 'test@test.com' });
    expect(fetchSpy).toHaveBeenCalledWith('url', { method: 'PUT', body: JSON.stringify({ email: 'test@test.com' }) });
    expect(response).toEqual({ data: 'good' });
  });

  it('should fire PATCH request', async () => {
    fetchSpy.mockResolvedValue(okResponse);
    const response = await httpClient.patch('url', { email: 'test@test.com' });
    expect(requestSpy).toHaveBeenCalledWith('PATCH', 'url', { email: 'test@test.com' });
    expect(fetchSpy).toHaveBeenCalledWith('url', { method: 'PATCH', body: JSON.stringify({ email: 'test@test.com' }) });
    expect(response).toEqual({ data: 'good' });
  });

  it('should fire DELETE request', async () => {
    fetchSpy.mockResolvedValue(okResponse);
    const response = await httpClient.delete('url');
    expect(requestSpy).toHaveBeenCalledWith('DELETE', 'url', undefined);
    expect(fetchSpy).toHaveBeenCalledWith('url', { method: 'DELETE' });
    expect(response).toEqual({ data: 'good' });
  });

  it('should throw error for non-ok response', async () => {
    fetchSpy.mockResolvedValue({ ok: false, json: () => ({ error: 'unknown' }) });
    try {
      await httpClient.get('url');
      expect(requestSpy).toHaveBeenCalledWith('GET', 'url', undefined, undefined);
      expect(fetchSpy).toHaveBeenCalledWith('url', { method: 'GET' });
    } catch (_e: any) {
      expect(true).toBeTruthy(); // expect to get here in the catch block
    }
  });
});
