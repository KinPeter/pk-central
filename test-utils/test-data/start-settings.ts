import { PkStartSettings, PkStartSettingsRequest } from 'pk-common';

export const validSettingsRequest: PkStartSettingsRequest = {
  name: 'testuser',
  weatherApiKey: 'WeatherApiKey123',
  locationApiKey: null,
  shortcutIconBaseUrl: 'https://other.p-kin.com/start-tile-icons/',
  birthdaysUrl: null,
  koreanUrl: 'https://docs.google.com/asd123aaa',
  stravaClientId: null,
  stravaClientSecret: null,
  stravaRedirectUri: null,
};

export const validSettings: PkStartSettings = {
  ...validSettingsRequest,
  id: 'abc123',
  userId: '123',
};

export const updatedSettings: PkStartSettings = {
  ...validSettings,
  locationApiKey: 'apiKey123',
  koreanUrl: null,
  stravaClientId: 'clientId',
};

export const invalidRequestBodies = [
  {
    name: 'testuser',
    weatherApiKey: 'WeatherApiKey123',
    locationApiKey: null,
    shortcutIconBaseUrl: 'https://other.p-kin.com/start-tile-icons/',
    birthdaysUrl: null,
    koreanUrl: 'not-a-valid-url',
    stravaClientId: null,
    stravaClientSecret: null,
    stravaRedirectUri: null,
  },
  {
    name: 'testuser',
    weatherApiKey: 'WeatherApiKey123',
    locationApiKey: undefined,
    shortcutIconBaseUrl: 'https://other.p-kin.com/start-tile-icons/',
    birthdaysUrl: null,
    koreanUrl: 'https://docs.google.com/asd123aaa',
    stravaClientId: null,
    stravaClientSecret: null,
    stravaRedirectUri: null,
  },
  {
    name: 'testuser',
    weatherApiKey: 'WeatherApiKey123',
    locationApiKey: null,
    shortcutIconBaseUrl: 'https://other.p-kin.com/start-tile-icons/',
    birthdaysUrl: true,
    koreanUrl: 'https://docs.google.com/asd123aaa',
    stravaClientId: null,
    stravaClientSecret: null,
    stravaRedirectUri: null,
  },
  {
    name: 'testuser',
    locationApiKey: null,
    shortcutIconBaseUrl: 'https://other.p-kin.com/start-tile-icons/',
    birthdaysUrl: null,
    koreanUrl: 'https://docs.google.com/asd123aaa',
    stravaClientId: null,
    stravaClientSecret: null,
    stravaRedirectUri: null,
  },
];
