import { PkStartSettings, PkStartSettingsRequest } from 'pk-common';

export function toPkStartSettingsRequest(body: Partial<PkStartSettings>): PkStartSettingsRequest {
  return {
    name: body.name ?? null,
    koreanUrl: body.koreanUrl ?? null,
    birthdaysUrl: body.birthdaysUrl ?? null,
    shortcutIconBaseUrl: body.shortcutIconBaseUrl ?? null,
    stravaClientId: body.stravaClientId ?? null,
    stravaClientSecret: body.stravaClientSecret ?? null,
    stravaRedirectUri: body.stravaRedirectUri ?? null,
    locationApiKey: body.locationApiKey ?? null,
    weatherApiKey: body.weatherApiKey ?? null,
  };
}
