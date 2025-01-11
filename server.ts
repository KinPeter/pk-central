import { importFunctions } from './server/import';
import { fileURLToPath } from 'url';
import { join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = join(__filename, '..');
const functionsDir = join(__dirname, 'functions');

importFunctions(functionsDir).catch(console.error);
