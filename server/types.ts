export interface Context {
  params: Record<string, string>;
}

export type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS';

export interface Config {
  path: string[];
  method: HTTPMethod[];
}

export type HandlerFunction = (req: Request, context: Context) => Promise<Response>;

export interface ApiFunctionModule {
  name: string;
  handler: HandlerFunction;
  config: Config;
}
