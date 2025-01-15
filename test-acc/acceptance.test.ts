import { describe, it } from 'node:test';
import { apiDocsTests } from './api-docs';
import { authTests } from './auth';

describe('Acceptance tests', async () => {
  const API_URL = process.env.TEST_API_URL || 'http://localhost:5678';

  await apiDocsTests(API_URL);
  await authTests(API_URL);
});
