import { readFileSync } from 'fs';
import { IncomingMessage, ServerResponse } from 'http';
import { join } from 'path';

export function serveDocs(docsDir: string, req: IncomingMessage, res: ServerResponse): void {
  const { url, method } = req;
  const baseRoute = process.env.SERVER_ROUTE || '';

  if ((url === `${baseRoute}` || url === `${baseRoute}/`) && method === 'GET') {
    // Serve the HTML file
    try {
      const data = readFileSync(join(docsDir, 'index.html'), 'utf-8');
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    } catch (err) {
      console.error(err);
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Internal Server Error');
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404: This is not the page you are looking for');
  }
}
