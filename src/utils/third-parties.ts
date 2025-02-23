import { DeeplLanguage } from '../../common';

export interface AirlabsAirportResponse {
  response: Array<{
    name: string;
    iata_code: string;
    icao_code: string;
    lat: number;
    lng: number;
    country_code: string; // uppercase
  }>;
}

export interface AirlabsAirlineResponse {
  response: Array<{
    name: string;
    iata_code: string;
    icao_code: string;
  }>;
}

export interface LocationIqReverseResponse {
  lat: string;
  lon: string;
  address: {
    city?: string;
    region?: string;
    country?: string; // native name!
    postcode?: string;
    country_code?: string; // lowercase
  };
}

export interface DeeplTranslationRequest {
  text: string;
  target_lang: string;
  source_lang?: string;
}

export interface DeeplTranslation {
  text: string;
  detected_source_language: string;
}

export interface DeeplTranslationResponse {
  translations: DeeplTranslation[];
}

export const sourceLanguages: Record<DeeplLanguage, string> = {
  da: 'DA',
  de: 'DE',
  en: 'EN',
  es: 'ES',
  fr: 'FR',
  hu: 'HU',
  it: 'IT',
  ja: 'JA',
  ko: 'KO',
  nl: 'NL',
  pl: 'PL',
  pt: 'PT',
  ru: 'RU',
  zh: 'ZH',
};

export const targetLanguages: Record<DeeplLanguage, string> = {
  da: 'DA',
  de: 'DE',
  en: 'EN-US',
  es: 'ES',
  fr: 'FR',
  hu: 'HU',
  it: 'IT',
  ja: 'JA',
  ko: 'KO',
  nl: 'NL',
  pl: 'PL',
  pt: 'PT-PT',
  ru: 'RU',
  zh: 'ZH-HANS',
};
