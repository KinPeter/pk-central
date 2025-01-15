import { describe } from '@jest/globals';
import { testOrder } from '../test-utils/acc-utils';
import { activitiesTests } from './activities';
import { apiDocsTests } from './api-docs';
import { authTests } from './auth';
import { dataBackupTests } from './data-backup';
import { flightsTests } from './flights';
import { notesTests } from './notes';
import { personalDataTests } from './personal-data';
import { proxyTests } from './proxy';
import { publicTests } from './public';
import { shortcutsTests } from './shortcuts';
import { startSettingTests } from './start-settings';
import { visitsTests } from './visits';

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
  notesTests(API_URL);
  personalDataTests(API_URL);
  shortcutsTests(API_URL);
  visitsTests(API_URL);
  publicTests(API_URL);
  dataBackupTests(API_URL);
  proxyTests(API_URL);
});
