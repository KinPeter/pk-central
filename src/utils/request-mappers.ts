import {
  NoteRequest,
  CyclingChore,
  CyclingChoreRequest,
  Note,
  PkStartSettings,
  PkStartSettingsRequest,
  Shortcut,
  ShortcutRequest,
  PersonalData,
  PersonalDataRequest,
  Visit,
  VisitRequest,
  Flight,
  FlightRequest,
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

export function toShortcutRequest(body: Partial<Shortcut>): ShortcutRequest {
  return {
    name: body.name!,
    url: body.url!,
    category: body.category!,
    iconUrl: body.iconUrl!,
    priority: body.priority!,
  };
}

export function toPersonalDataRequest(body: Partial<PersonalData>): PersonalDataRequest {
  return {
    name: body.name!,
    identifier: body.identifier!,
    expiry: body.expiry!,
  };
}

export function toVisitRequest(body: Partial<Visit>): VisitRequest {
  return {
    city: body.city!,
    country: body.country!,
    lat: body.lat!,
    lng: body.lng!,
    year: body.year,
  };
}

export function toFlightRequest(body: Partial<Flight>): FlightRequest {
  return {
    aircraft: {
      name: body.aircraft!.name,
      icao: body.aircraft!.icao,
    },
    airline: {
      name: body.airline!.name,
      icao: body.airline!.icao,
      iata: body.airline!.iata,
    },
    arrivalTime: body.arrivalTime!,
    date: body.date!,
    departureTime: body.departureTime!,
    distance: body.distance!,
    duration: body.duration!,
    flightClass: body.flightClass!,
    flightNumber: body.flightNumber!,
    flightReason: body.flightReason!,
    from: {
      city: body.from!.city,
      country: body.from!.country,
      name: body.from!.name,
      icao: body.from!.icao,
      iata: body.from!.iata,
      lat: body.from!.lat,
      lng: body.from!.lng,
    },
    to: {
      city: body.to!.city,
      country: body.to!.country,
      name: body.to!.name,
      icao: body.to!.icao,
      iata: body.to!.iata,
      lat: body.to!.lat,
      lng: body.to!.lng,
    },
    note: body.note!,
    registration: body.registration!,
    seatNumber: body.seatNumber!,
    seatType: body.seatType!,
    isPlanned: body.isPlanned ?? false,
  };
}
