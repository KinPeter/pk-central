import { PkStartSettings, type PkStartSettingsRequest } from '../../common';

export const validSettingsRequest: PkStartSettingsRequest = {
  name: 'testuser',
  shortcutIconBaseUrl: 'https://other.p-kin.com/start-tile-icons/',
  birthdaysUrl: 'https://stuff.p-kin.com/mock-bdays.tsv',
  stravaRedirectUri: null,
};

export const sharedSettings: Partial<PkStartSettings> = {
  openWeatherApiKey: 'openWeatherApiKey',
  locationIqApiKey: 'locationIqApiKey',
  unsplashApiKey: 'unsplashApiKey',
  stravaClientId: 'stravaClientId',
  stravaClientSecret: 'stravaClientSecret',
};

export const validSettings: PkStartSettings = {
  ...sharedSettings,
  ...validSettingsRequest,
  id: 'abc123',
  userId: '123',
} as PkStartSettings;

export const updatedSettings: PkStartSettings = {
  ...sharedSettings,
  ...validSettings,
  name: 'new name',
};

export const invalidRequestBodies = [
  {
    name: 234,
    shortcutIconBaseUrl: 'https://other.p-kin.com/start-tile-icons/',
    birthdaysUrl: null,
    stravaRedirectUri: null,
  },
  {
    name: 'testuser',
    shortcutIconBaseUrl: 'https://other.p-kin.com/start-tile-icons/',
    birthdaysUrl: 'not-a-url',
    stravaRedirectUri: null,
  },
  {
    name: 'testuser',
    shortcutIconBaseUrl: 'https://other.p-kin.com/start-tile-icons/',
    birthdaysUrl: true,
    stravaRedirectUri: null,
  },
  {
    name: 'testuser',
    shortcutIconBaseUrl: 'not-a-url',
    birthdaysUrl: null,
    stravaRedirectUri: null,
  },
  {
    name: 'testuser',
    shortcutIconBaseUrl: 'https://other.p-kin.com/start-tile-icons/',
    birthdaysUrl: null,
    stravaRedirectUri: 'not-a-url',
  },
];
