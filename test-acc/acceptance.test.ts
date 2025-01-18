import process from 'node:process';
import { describe } from 'node:test';
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
import { startSettingsTests } from './start-settings';
import { visitsTests } from './visits';

describe('Acceptance tests', async () => {
  const API_URL = process.env.TEST_API_URL || 'http://localhost:5678';

  if (process.env.TEST_ENV === 'docker') {
    await new Promise(resolve => setTimeout(resolve, 30000));
  }

  await apiDocsTests(API_URL);
  await authTests(API_URL);
  await startSettingsTests(API_URL);
  await activitiesTests(API_URL);
  await flightsTests(API_URL);
  await notesTests(API_URL);
  await personalDataTests(API_URL);
  await shortcutsTests(API_URL);
  await visitsTests(API_URL);
  await publicTests(API_URL);
  await dataBackupTests(API_URL);
  await proxyTests(API_URL);
});
