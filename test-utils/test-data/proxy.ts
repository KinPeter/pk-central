export const birthdaysTsv = 'father\t08/30\r\nmother\t04/14';
export const birthdaysResponse = [
  { name: 'father', date: '08/30' },
  { name: 'mother', date: '04/14' },
];

export const airlabsAirportData = {
  response: [
    {
      name: 'Incheon Airport',
      iata_code: 'ICN',
      icao_code: 'IIII',
      lat: 23.222,
      lng: 10,
      country_code: 'KR',
    },
  ],
};

export const airlabsAirlineData = {
  response: [
    {
      name: 'Turkish Airlines',
      iata_code: 'TK',
      icao_code: 'THY',
    },
  ],
};

export const locationIqLocationData = {
  address: {
    city: 'Seoul',
    country_code: 'kr',
  },
};

export const airportResponse = {
  city: 'Seoul',
  country: 'South Korea',
  iata: 'ICN',
  icao: 'IIII',
  lat: 23.222,
  lng: 10,
  name: 'Incheon Airport',
};

export const airlineResponse = {
  name: 'Turkish Airlines',
  iata: 'TK',
  icao: 'THY',
};

export const cityResponse = {
  city: 'Seoul',
  country: 'South Korea',
  lat: 23.222,
  lng: 10,
};

export const validTranslationRequest = {
  text: 'Szia ott',
  targetLang: 'en',
  sourceLang: 'hu',
};

export const invalidTranslationRequests = [
  {
    text: '',
    targetLang: 'en',
    sourceLang: 'hu',
  },
  {
    text: 'Szia ott',
    targetLang: 'en',
    sourceLang: 'xx',
  },
  {
    text: 'Szia ott',
    targetLang: 'xx',
    sourceLang: 'hu',
  },
];

export const translationResponse = {
  original: 'Szia ott',
  translation: 'Hello there',
  targetLang: 'en',
  sourceLang: 'hu',
};

export const deeplTranslationResponse = {
  translations: [
    {
      text: 'Hello there',
      detected_source_language: 'HU',
    },
  ],
};
