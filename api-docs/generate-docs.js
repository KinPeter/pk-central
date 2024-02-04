import YAML from 'yaml';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

const yamlPath = path.resolve(__dirname, 'api-docs.yaml');
const htmlPath = path.resolve(__dirname, 'index.html');
const docs = YAML.parse(fs.readFileSync(yamlPath, { encoding: 'utf-8' }));

const string = JSON.stringify(docs, null, 2);

const htmlStart = `<!doctype html><html lang="en"><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0"/><meta http-equiv="X-UA-Compatible" content="ie=edge" /><title>PK Central</title></head><body>`;

const htmlEnd = `</body></html>`;

const content = htmlStart + `<p>${string}<p/>` + htmlEnd;

fs.writeFileSync(htmlPath, content);
