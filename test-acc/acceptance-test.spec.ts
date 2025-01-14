import { describe } from '@jest/globals';
import { testOrder } from '../test-utils/acc-utils';
import { activitiesTests } from './activities';
import { apiDocsTests } from './api-docs';
import { authTests } from './auth';
import { flightsTests } from './flights';
import { startSettingTests } from './start-settings';

describe('Acceptance Test', () => {
  const API_URL = process.env.TEST_API_URL || 'http://localhost:5678';

  beforeAll(async () => {
    await testOrder;
  });

  apiDocsTests(API_URL);
  authTests(API_URL);
  startSettingTests(API_URL);
  activitiesTests(API_URL);
  flightsTests(API_URL);
});
