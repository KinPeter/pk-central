import YAML from 'yaml';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { encode } from 'html-entities';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const yamlPath = path.resolve(__dirname, 'api-docs.yaml');
const htmlPath = path.resolve(__dirname, 'index.html');
const docs = YAML.parse(fs.readFileSync(yamlPath, { encoding: 'utf-8' }));

const htmlStart = `<!doctype html><html lang="en"><head><link rel="icon" type="image/x-icon" href="favicon.ico" /><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@500&display=swap" rel="stylesheet"><link rel="stylesheet" href="index.css"><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0"/><meta http-equiv="X-UA-Compatible" content="ie=edge" /><title>PK Central</title></head><body>`;
const htmlEnd = `</body></html>`;

let content = `<h1>PK Central API</h1>`;

docs.functions.forEach(fn => {
  let fnContent = `<div class="function"><h2>${fn.name}</h2><p>${fn.description}</p>`;

  fn.endpoints?.forEach(endpoint => {
    fnContent += `
      <div class="endpoint ${endpoint.method.toLowerCase()}">
        <details>
          <summary>
            <span class="method">${endpoint.method}</span>
            <span class="route">${endpoint.route}</span>
          </summary>
          <div class="details">
            <p>${endpoint.description}</p>
            <p class="info">
              <span>Request body:<code class="request">${endpoint.request ?? 'None'}</code></span>
              <span>Returns:<code class="response">${endpoint.response}</code></span>
              <span>Authenticated:<span class="authenticated">${endpoint.authenticated ? 'Yes' : 'No'}</span></span>
            </p>
          </div>
        </details>
      </div>
    `;
  });

  fnContent += `</div>`;

  if (fn.types) {
    const typeFile = fs.readFileSync(path.resolve(__dirname, `../common/${fn.types}`), { encoding: 'utf-8' });
    fnContent += `
      <details class="code-block-details">
        <summary class="code-block-summary">${fn.name} types</summary>
        <pre>${encode(typeFile)}</pre>
      </details>
    `;
  }

  if (fn.validators) {
    const validatorsFile = fs.readFileSync(path.resolve(__dirname, `../common/${fn.validators}`), {
      encoding: 'utf-8',
    });
    fnContent += `
      <details class="code-block-details">
        <summary class="code-block-summary">${fn.name} validators</summary>
        <pre>${validatorsFile}</pre>
      </details>
    `;
  }

  content += fnContent;
});

const html = htmlStart + content + htmlEnd;

fs.writeFileSync(htmlPath, html);
