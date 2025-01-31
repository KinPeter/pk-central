export const DeeplLanguage = {
  DA: 'da',
  DE: 'de',
  EN: 'en',
  ES: 'es',
  FR: 'fr',
  HU: 'hu',
  IT: 'it',
  JA: 'ja',
  KO: 'ko',
  NL: 'nl',
  PL: 'pl',
  PT: 'pt',
  RU: 'ru',
  ZH: 'zh',
};

export type DeeplLanguage = (typeof DeeplLanguage)[keyof typeof DeeplLanguage];
