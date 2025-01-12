import { serveDocs } from './server/api-docs';
import { serveFunction } from './server/functions';
import { importFunctions } from './server/import';
import { fileURLToPath } from 'url';
import { join } from 'path';
import http, { IncomingMessage, ServerResponse } from 'http';
import 'dotenv/config';

const hostname = '0.0.0.0';
const port = 5678;

const __filename = fileURLToPath(import.meta.url);
const __dirname = join(__filename, '..');
const functionsDir = join(__dirname, 'functions');
const docsDir = join(__dirname, 'api-docs');

const functions = await importFunctions(functionsDir);

const server = http.createServer(async (req: IncomingMessage, res: ServerResponse) => {
  if (req.method === 'GET' && (req.url === '/' || req.url === '/index.css')) {
    serveDocs(docsDir, req, res);
    return;
  }

  await serveFunction(req, res, functions);
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
