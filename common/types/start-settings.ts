import type { UUID } from './misc';

export interface PkStartSettingsResource {
  id: UUID;
  userId: UUID;
  name: string | null;
  shortcutIconBaseUrl: string | null;
  birthdaysUrl: string | null;
  stravaRedirectUri: string | null;
}

export interface PkStartSettings extends PkStartSettingsResource {
  /* coming from shared keys: */
  openWeatherApiKey: string | null;
  locationIqApiKey: string | null;
  unsplashApiKey: string | null;
  stravaClientId: string | null;
  stravaClientSecret: string | null;
}

export type PkStartSettingsRequest = Pick<
  PkStartSettings,
  'name' | 'shortcutIconBaseUrl' | 'birthdaysUrl' | 'stravaRedirectUri'
>;
