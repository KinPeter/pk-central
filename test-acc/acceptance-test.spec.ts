import { describe } from '@jest/globals';
import { apiDocsTests } from './api-docs';
import { authTests } from './auth';

describe('Acceptance Test', () => {
  const API_URL = process.env.TEST_API_URL || 'http://localhost:5678';
  apiDocsTests(API_URL);
  authTests(API_URL);
});
