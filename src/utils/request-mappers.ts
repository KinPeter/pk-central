import {
  NoteRequest,
  CyclingChore,
  CyclingChoreRequest,
  Note,
  PkStartSettings,
  PkStartSettingsRequest,
} from 'pk-common';

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
    unsplashApiKey: body.unsplashApiKey ?? null,
  };
}

export function toCyclingChoreRequest(body: Partial<CyclingChore>): CyclingChoreRequest {
  return {
    name: body.name!,
    lastKm: body.lastKm!,
    kmInterval: body.kmInterval!,
  };
}

export function toNoteRequest(body: Partial<Note>): NoteRequest {
  return {
    text: body.text,
    archived: !!body.archived,
    pinned: !!body.pinned,
    links: body.links?.map(linkBody => ({ name: linkBody.name, url: linkBody.url })) ?? [],
  };
}
