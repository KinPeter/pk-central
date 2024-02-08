import { UUID } from './misc';

export interface PkStartSettings {
  id: UUID;
  userId: UUID;
  name: string | null;
  weatherApiKey: string | null;
  locationApiKey: string | null;
  unsplashApiKey: string | null;
  shortcutIconBaseUrl: string | null;
  birthdaysUrl: string | null;
  koreanUrl: string | null;
  stravaClientId: string | null;
  stravaClientSecret: string | null;
  stravaRedirectUri: string | null;
}

export type PkStartSettingsRequest = Omit<PkStartSettings, 'id' | 'userId'>;
