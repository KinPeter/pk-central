import { IncomingMessage } from 'http';

export function stripPathname(pathname: string): string {
  const baseRoute = process.env.SERVER_ROUTE || '';
  if (!baseRoute) {
    return pathname;
  }
  if (pathname.startsWith(baseRoute)) {
    return pathname.slice(baseRoute.length);
  }
  return '';
}

export function convertRequest(req: IncomingMessage, body: string): Request {
  const { url, method } = req;
  const reqUrl = `https://${req.headers.host}${url}`;
  const headersInit: Record<string, string> = {};
  for (const [key, value] of Object.entries(req.headers)) {
    headersInit[key] = value as string;
  }
  const headers = new Headers(headersInit);

  let request: Request;

  if (body) {
    request = new Request(reqUrl, { method, headers, body });
  } else {
    request = new Request(reqUrl, { method, headers });
  }

  return request;
}

export function getParams(pathOptions: string[], pathname: string): Record<string, string> {
  for (const pathOption of pathOptions) {
    const pathParts = pathOption.split('/').filter(part => part.length > 0);
    const pathVariables: Record<string, string> = {};
    const pathnameParts = pathname.split('/').filter(part => part.length > 0);

    if (pathParts.length !== pathnameParts.length) {
      continue;
    }

    let isMatch = true;

    for (let i = 0; i < pathParts.length; i++) {
      const pathPart = pathParts[i];
      const pathnamePart = pathnameParts[i];

      if (pathPart.startsWith(':')) {
        const variableName = pathPart.slice(1);
        pathVariables[variableName] = pathnamePart;
      } else if (pathPart !== pathnamePart) {
        isMatch = false;
        break;
      }
    }

    if (isMatch) {
      return pathVariables;
    }
  }

  return {};
}
