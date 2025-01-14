import { describe } from '@jest/globals';
import { testOrder } from '../test-utils/acc-utils';
import { apiDocsTests } from './api-docs';
import { authTests } from './auth';

describe('Acceptance Test', () => {
  const API_URL = process.env.TEST_API_URL || 'http://localhost:5678';

  beforeAll(async () => {
    await testOrder;
  });

  apiDocsTests(API_URL);
  authTests(API_URL);
});
