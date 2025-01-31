import { DeeplLanguage } from '../enums/proxy';

export interface BirthdayItem {
  name: string;
  date: string;
}

export interface TranslationRequest {
  text: string;
  targetLang: DeeplLanguage;
  sourceLang: DeeplLanguage;
}

export interface TranslationResponse {
  original: string;
  translation: string;
  targetLang: DeeplLanguage;
  sourceLang: DeeplLanguage;
}
