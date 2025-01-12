import { IncomingMessage, ServerResponse } from 'http';
import { parse } from 'url';
import { convertRequest, getParams } from './request-utils';
import { ApiFunctionModule, Context, type HTTPMethod } from './types';

export async function serveFunction(
  req: IncomingMessage,
  res: ServerResponse,
  functions: ApiFunctionModule[]
): Promise<void> {
  const { method, url } = req;
  const parsedUrl = parse(url || '', true);
  const pathname = parsedUrl.pathname;
  console.log('\nRequest:', method, pathname);

  // Set the default response headers
  res.setHeader('Content-Type', 'application/json');

  const functionName = pathname?.split('/')[1];
  const handlerModule = functions.find(f => f.name === functionName);

  if (!handlerModule) {
    res.statusCode = 404;
    console.log('Response:', 404, 'Function not found:', functionName);
    res.end(JSON.stringify({ error: '404: Not Found' }));
    return;
  }

  const {
    handler,
    config: { method: allowedMethods, path: pathOptions },
  } = handlerModule;

  if (!allowedMethods.includes(method as HTTPMethod)) {
    res.statusCode = 405;
    console.log('Response:', 405, 'Method not allowed:', method);
    res.end(JSON.stringify({ error: '405: Method Not Allowed' }));
    return;
  }

  const context: Context = { params: getParams(pathOptions, pathname!) };
  let body = '';

  req.on('data', chunk => {
    body += chunk.toString();
  });

  req.on('end', async () => {
    const request = convertRequest(req, body);
    const response = await handler(request, context);
    const responseBody = await response.text();
    res.statusCode = response.status;
    console.log('Response:', response.status, responseBody.substring(0, 100), responseBody.length > 100 ? '...' : '');
    res.end(responseBody);
  });
}
