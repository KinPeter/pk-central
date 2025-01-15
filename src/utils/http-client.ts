export const FetchResponseType = {
  JSON: 'JSON',
  TEXT: 'TEXT',
} as const;

export type FetchResponseType = (typeof FetchResponseType)[keyof typeof FetchResponseType];

export type FetchFn = typeof fetch;

export class HttpClient {
  private readonly fetch: FetchFn;
  private defaultHeaders: Record<string, string> = {};
  private headers: Record<string, string> = {};

  constructor(fetchFn: FetchFn) {
    this.fetch = fetchFn;
    this.headers = { ...this.defaultHeaders };
  }

  public setHeaders(headers: Record<string, string>): void {
    this.headers = {
      ...this.defaultHeaders,
      ...headers,
    };
  }

  public async get<T>(path: string, responseType?: FetchResponseType): Promise<T> {
    return await this.request('GET', path, undefined, responseType);
  }

  public async post<T>(path: string, body: unknown): Promise<T> {
    return await this.request('POST', path, body);
  }

  public async put<T>(path: string, body: unknown): Promise<T> {
    return await this.request('PUT', path, body);
  }

  public async patch<T>(path: string, body: unknown): Promise<T> {
    return await this.request('PATCH', path, body);
  }

  public async delete<T>(path: string): Promise<T> {
    return await this.request('DELETE', path, undefined);
  }

  private async request<T>(
    method: string,
    path: string,
    body: unknown,
    responseType: FetchResponseType = FetchResponseType.JSON
  ): Promise<T> {
    const requestInit: RequestInit = { method };
    if (body) {
      requestInit.body = JSON.stringify(body);
    }
    if (Object.keys(this.headers).length) {
      requestInit.headers = { ...this.headers };
    }
    const response: any = await this.fetch(path, requestInit);
    if (!response.ok) {
      const { error } = await response.json();
      console.error(`Error during the ${method}: ${path} request.`, {
        method,
        path,
        body,
        status: response.status,
        error,
      });
      throw new Error(error);
    }

    if (responseType === FetchResponseType.TEXT) {
      return (await response.text()) as T;
    }
    return (await response.json()) as T;
  }
}
