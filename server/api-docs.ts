import { readFileSync } from 'fs';
import { IncomingMessage, ServerResponse } from 'http';
import { join } from 'path';

export function serveDocs(docsDir: string, req: IncomingMessage, res: ServerResponse): void {
  const { url, method } = req;

  if (url === '/' && method === 'GET') {
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
  } else if (url === '/index.css' && method === 'GET') {
    // Serve the CSS file
    try {
      const data = readFileSync(join(docsDir, 'index.css'), 'utf-8');
      res.writeHead(200, { 'Content-Type': 'text/css' });
      res.end(data);
    } catch (err) {
      console.error(err);
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Internal Server Error');
    }
  }
}
